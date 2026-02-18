import os from 'os';

// 检测是否在极简容器环境（没有 shell 命令）
let isMinimalContainer = false;

export interface MetricsSnapshot {
  cpu: number;
  memory: number;
  memoryUsed: number;
  memoryFree: number;
  disk: number;
  diskUsed: number;
  diskFree: number;
  diskTotal: number;
  netRx: number;
  netTx: number;
  loadAvg: number[];
  timestamp: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  memoryBytes: number;
  user: string;
  status: string;
}

export interface PortInfo {
  protocol: string;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  pid: number;
  processName: string;
}

export interface DiskPartition {
  name: string;
  mountPoint: string;
  fsType: string;
  total: number;
  used: number;
  free: number;
  usedPercent: number;
  unavailable?: string;
}

export interface NetworkInterface {
  name: string;
  mac: string;
  ipv4: string[];
  ipv6: string[];
  status: string;
}

export interface SystemInfo {
  hostname: string;
  platform: string;
  release: string;
  arch: string;
  uptime: number;
  timezone: string;
  currentTime: string;
  cpu: {
    model: string;
    cores: number;
    threads: number;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    swapTotal: number;
    swapUsed: number;
    swapFree: number;
  };
  network: {
    interfaces: NetworkInterface[];
    publicIp: string;
  };
  unavailable?: string;
}

let lastCpuInfo: { idle: number; total: number } | null = null;
let lastNetInfo: { rx: number; tx: number; time: number } | null = null;

function getCpuUsage(): number {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    idle += cpu.times.idle;
    total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
  }

  if (!lastCpuInfo) {
    lastCpuInfo = { idle, total };
    return 0;
  }

  const idleDiff = idle - lastCpuInfo.idle;
  const totalDiff = total - lastCpuInfo.total;
  lastCpuInfo = { idle, total };

  if (totalDiff === 0) return 0;
  return Math.round((1 - idleDiff / totalDiff) * 100 * 10) / 10;
}

// Windows 内存缓存
let cachedWinMemory: { total: number; used: number; free: number; usedPercent: number } | null = null;
let lastWinMemoryTime = 0;

async function getMemoryInfoAsync(): Promise<{ total: number; used: number; free: number; usedPercent: number }> {
  const platform = os.platform();
  
  if (platform === 'win32' && !isMinimalContainer) {
    const now = Date.now();
    // 缓存 2 秒，避免频繁调用 PowerShell
    if (cachedWinMemory && now - lastWinMemoryTime < 2000) {
      return cachedWinMemory;
    }
    
    try {
      // 使用 WMI 获取准确的内存信息
      const result = await Bun.$`powershell -Command "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      // WMI 返回的是 KB
      const total = (Number(data.TotalVisibleMemorySize) || 0) * 1024;
      const free = (Number(data.FreePhysicalMemory) || 0) * 1024;
      const used = total - free;
      
      cachedWinMemory = {
        total,
        used,
        free,
        usedPercent: total > 0 ? Math.round((used / total) * 100 * 10) / 10 : 0,
      };
      lastWinMemoryTime = now;
      return cachedWinMemory;
    } catch {
      // 失败时回退到 Node.js API
    }
  }
  
  // 非 Windows 或失败时使用 Node.js API
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    total,
    used,
    free,
    usedPercent: Math.round((used / total) * 100 * 10) / 10,
  };
}

// 同步版本，用于不需要精确值的场景
function getMemoryInfo(): { total: number; used: number; free: number; usedPercent: number } {
  // 如果有缓存，返回缓存
  if (cachedWinMemory && Date.now() - lastWinMemoryTime < 5000) {
    return cachedWinMemory;
  }
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    total,
    used,
    free,
    usedPercent: Math.round((used / total) * 100 * 10) / 10,
  };
}

async function getDiskInfo(): Promise<{ total: number; used: number; free: number; usedPercent: number }> {
  if (isMinimalContainer) {
    return { total: 0, used: 0, free: 0, usedPercent: 0 };
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      const result = await Bun.$`powershell -Command "Get-PSDrive C | Select-Object @{N='Used';E={$_.Used}},@{N='Free';E={$_.Free}} | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      const used = Number(data.Used) || 0;
      const free = Number(data.Free) || 0;
      const total = used + free;
      return {
        total,
        used,
        free,
        usedPercent: total > 0 ? Math.round((used / total) * 100 * 10) / 10 : 0,
      };
    } else {
      const result = await Bun.$`df -B1 / | tail -1 | awk '{print $2, $3, $4}'`.quiet();
      const [total, used, free] = result.stdout.toString().trim().split(/\s+/).map(Number);
      return {
        total: total || 0,
        used: used || 0,
        free: free || 0,
        usedPercent: total > 0 ? Math.round(((used || 0) / total) * 100 * 10) / 10 : 0,
      };
    }
  } catch {
    isMinimalContainer = true;
    return { total: 0, used: 0, free: 0, usedPercent: 0 };
  }
}

async function getNetworkStats(): Promise<{ rx: number; tx: number }> {
  if (isMinimalContainer) {
    return { rx: 0, tx: 0 };
  }
  
  const platform = os.platform();
  const now = Date.now();
  
  try {
    let rx = 0;
    let tx = 0;

    if (platform === 'win32') {
      const result = await Bun.$`powershell -Command "Get-NetAdapterStatistics | Select-Object ReceivedBytes, SentBytes | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      const stats = Array.isArray(data) ? data : [data];
      for (const stat of stats) {
        rx += stat.ReceivedBytes || 0;
        tx += stat.SentBytes || 0;
      }
    } else if (platform === 'darwin') {
      const result = await Bun.$`netstat -ib | grep -E "^en[0-9]" | head -1 | awk '{print $7, $10}'`.quiet();
      const parts = result.stdout.toString().trim().split(/\s+/);
      rx = parseInt(parts[0]) || 0;
      tx = parseInt(parts[1]) || 0;
    } else {
      const result = await Bun.$`cat /proc/net/dev | grep -E "eth|ens|enp" | head -1 | awk '{print $2, $10}'`.quiet();
      const parts = result.stdout.toString().trim().split(/\s+/);
      rx = parseInt(parts[0]) || 0;
      tx = parseInt(parts[1]) || 0;
    }

    if (!lastNetInfo) {
      lastNetInfo = { rx, tx, time: now };
      return { rx: 0, tx: 0 };
    }

    const timeDiff = (now - lastNetInfo.time) / 1000;
    const rxRate = Math.round((rx - lastNetInfo.rx) / timeDiff);
    const txRate = Math.round((tx - lastNetInfo.tx) / timeDiff);
    lastNetInfo = { rx, tx, time: now };

    return { rx: Math.max(0, rxRate), tx: Math.max(0, txRate) };
  } catch {
    isMinimalContainer = true;
    return { rx: 0, tx: 0 };
  }
}

export async function collectMetrics(): Promise<MetricsSnapshot> {
  const [diskInfo, network, memInfo] = await Promise.all([
    getDiskInfo(),
    getNetworkStats(),
    getMemoryInfoAsync(),
  ]);

  return {
    cpu: getCpuUsage(),
    memory: memInfo.usedPercent,
    memoryUsed: memInfo.used,
    memoryFree: memInfo.free,
    disk: diskInfo.usedPercent,
    diskUsed: diskInfo.used,
    diskFree: diskInfo.free,
    diskTotal: diskInfo.total,
    netRx: network.rx,
    netTx: network.tx,
    loadAvg: os.platform() === 'win32' ? [0, 0, 0] : os.loadavg(),
    timestamp: Math.floor(Date.now() / 1000),
  };
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const cpus = os.cpus();
  const [memInfo, swapInfo] = await Promise.all([
    getMemoryInfoAsync(),
    getSwapInfo(),
  ]);
  const interfaces = getNetworkInterfaces();
  
  const info: SystemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    uptime: os.uptime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currentTime: new Date().toISOString(),
    cpu: {
      model: cpus[0]?.model || 'Unknown',
      cores: cpus.length,
      threads: cpus.length,
      speed: cpus[0]?.speed || 0,
    },
    memory: {
      total: memInfo.total,
      used: memInfo.used,
      free: memInfo.free,
      ...swapInfo,
    },
    network: {
      interfaces,
      publicIp: '',
    },
  };
  
  if (isMinimalContainer) {
    info.unavailable = '部分信息在极简容器环境中不可用';
  }
  
  return info;
}

async function getSwapInfo(): Promise<{ swapTotal: number; swapUsed: number; swapFree: number }> {
  if (isMinimalContainer) {
    return { swapTotal: 0, swapUsed: 0, swapFree: 0 };
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      const result = await Bun.$`powershell -Command "Get-CimInstance Win32_PageFileUsage | Select-Object AllocatedBaseSize, CurrentUsage | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      const item = Array.isArray(data) ? data[0] : data;
      const total = (item?.AllocatedBaseSize || 0) * 1024 * 1024;
      const used = (item?.CurrentUsage || 0) * 1024 * 1024;
      return { swapTotal: total, swapUsed: used, swapFree: total - used };
    } else if (platform === 'darwin') {
      const result = await Bun.$`sysctl vm.swapusage`.quiet();
      const output = result.stdout.toString();
      const match = output.match(/total = ([\d.]+)M\s+used = ([\d.]+)M\s+free = ([\d.]+)M/);
      if (match) {
        return {
          swapTotal: parseFloat(match[1]) * 1024 * 1024,
          swapUsed: parseFloat(match[2]) * 1024 * 1024,
          swapFree: parseFloat(match[3]) * 1024 * 1024,
        };
      }
    } else {
      const result = await Bun.$`cat /proc/meminfo | grep -E "^Swap"`.quiet();
      const lines = result.stdout.toString().trim().split('\n');
      let swapTotal = 0, swapFree = 0;
      for (const line of lines) {
        const [key, value] = line.split(':').map(s => s.trim());
        const kb = parseInt(value) || 0;
        if (key === 'SwapTotal') swapTotal = kb * 1024;
        if (key === 'SwapFree') swapFree = kb * 1024;
      }
      return { swapTotal, swapUsed: swapTotal - swapFree, swapFree };
    }
  } catch {
    isMinimalContainer = true;
  }
  return { swapTotal: 0, swapUsed: 0, swapFree: 0 };
}

function getNetworkInterfaces(): NetworkInterface[] {
  const interfaces = os.networkInterfaces();
  const result: NetworkInterface[] = [];
  
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    const iface: NetworkInterface = {
      name,
      mac: '',
      ipv4: [],
      ipv6: [],
      status: 'up',
    };
    for (const addr of addrs) {
      if (addr.mac && addr.mac !== '00:00:00:00:00:00') {
        iface.mac = addr.mac;
      }
      if (addr.family === 'IPv4') {
        iface.ipv4.push(addr.address);
      } else if (addr.family === 'IPv6' && !addr.address.startsWith('fe80')) {
        iface.ipv6.push(addr.address);
      }
    }
    if (iface.ipv4.length > 0 || iface.ipv6.length > 0) {
      result.push(iface);
    }
  }
  return result;
}

export async function getDiskPartitions(): Promise<DiskPartition[]> {
  if (isMinimalContainer) {
    return [{ name: '-', mountPoint: '-', fsType: '-', total: 0, used: 0, free: 0, usedPercent: 0, unavailable: '极简容器环境不支持磁盘分区查询' }];
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      const result = await Bun.$`powershell -Command "Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace, FileSystem | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      const drives = Array.isArray(data) ? data : [data];
      return drives.map(d => {
        const total = Number(d.Size) || 0;
        const free = Number(d.FreeSpace) || 0;
        const used = total - free;
        return {
          name: d.DeviceID,
          mountPoint: d.DeviceID + '\\',
          fsType: d.FileSystem || 'NTFS',
          total,
          used,
          free,
          usedPercent: total > 0 ? Math.round((used / total) * 100 * 10) / 10 : 0,
        };
      }).filter(d => d.total > 0);
    } else {
      const result = await Bun.$`df -BT 2>/dev/null | grep -vE "^Filesystem|tmpfs|devtmpfs|overlay" || df -B1 2>/dev/null | grep -vE "^Filesystem|tmpfs|devtmpfs|overlay"`.quiet();
      const lines = result.stdout.toString().trim().split('\n').filter(l => l);
      return lines.map(line => {
        const parts = line.split(/\s+/);
        const hasType = parts.length >= 7;
        const total = parseInt(parts[hasType ? 2 : 1]) || 0;
        const used = parseInt(parts[hasType ? 3 : 2]) || 0;
        const free = parseInt(parts[hasType ? 4 : 3]) || 0;
        return {
          name: parts[0],
          mountPoint: parts[hasType ? 6 : 5] || '/',
          fsType: hasType ? parts[1] : 'unknown',
          total,
          used,
          free,
          usedPercent: total > 0 ? Math.round((used / total) * 100 * 10) / 10 : 0,
        };
      }).filter(p => p.total > 0);
    }
  } catch {
    isMinimalContainer = true;
    return [{ name: '-', mountPoint: '-', fsType: '-', total: 0, used: 0, free: 0, usedPercent: 0, unavailable: '极简容器环境不支持磁盘分区查询' }];
  }
}

// Windows 进程 CPU 缓存，用于计算 CPU 使用率差值
let lastWinProcessCpu: Map<number, { kernelTime: number; userTime: number; time: number }> = new Map();

export async function getProcessList(sortBy: 'cpu' | 'memory' = 'cpu', limit = 20): Promise<ProcessInfo[] | { unavailable: string }> {
  if (isMinimalContainer) {
    return { unavailable: '极简容器环境不支持进程列表查询（无 ps 命令）' };
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      // 使用 Get-Process 获取更准确的 CPU 时间
      const cmd = `Get-Process | Where-Object { $_.Id -ne 0 } | Select-Object Id, ProcessName, @{N='CPU';E={$_.CPU}}, WorkingSet64 | ConvertTo-Json -Depth 2`;
      const result = await Bun.$`powershell -Command ${cmd}`.quiet();
      const stdout = result.stdout.toString().trim();
      if (!stdout) return [];
      
      const data = JSON.parse(stdout);
      const processes = Array.isArray(data) ? data : [data];
      const totalMem = os.totalmem();
      const cpuCount = os.cpus().length;
      const now = Date.now();

      // 计算每个进程的 CPU 使用率（基于 CPU 时间差）
      const processInfos: ProcessInfo[] = [];
      const newCache = new Map<number, { kernelTime: number; userTime: number; time: number }>();

      for (const p of processes) {
        const pid = p.Id as number;
        const cpuTime = (Number(p.CPU) || 0) * 1000; // CPU 属性是秒，转为毫秒
        const memBytes = Number(p.WorkingSet64) || 0;
        const memPercent = totalMem > 0 ? Math.round((memBytes / totalMem) * 100 * 10) / 10 : 0;

        let cpuPercent = 0;
        const lastInfo = lastWinProcessCpu.get(pid);
        if (lastInfo) {
          const timeDiff = now - lastInfo.time;
          if (timeDiff > 0) {
            const cpuDiff = cpuTime - lastInfo.userTime;
            // CPU 使用率 = CPU时间差 / (实际时间差 * CPU核心数) * 100
            cpuPercent = Math.round((cpuDiff / (timeDiff * cpuCount)) * 100 * 10) / 10;
            cpuPercent = Math.max(0, Math.min(100, cpuPercent)); // 限制在 0-100
          }
        }

        newCache.set(pid, { kernelTime: 0, userTime: cpuTime, time: now });

        processInfos.push({
          pid,
          name: p.ProcessName as string,
          cpu: cpuPercent,
          memory: memPercent,
          memoryBytes: memBytes,
          user: '',
          status: 'running',
        });
      }

      lastWinProcessCpu = newCache;

      // 按 CPU 或内存排序
      processInfos.sort((a, b) => sortBy === 'cpu' ? b.cpu - a.cpu : b.memory - a.memory);
      return processInfos.slice(0, limit);
    } else {
      const sortFlag = sortBy === 'cpu' ? '-pcpu' : '-pmem';
      const result = await Bun.$`ps aux --sort=${sortFlag} | head -${limit + 1} | tail -${limit}`.quiet();
      const lines = result.stdout.toString().trim().split('\n').filter(l => l);
      return lines.map(line => {
        const parts = line.split(/\s+/);
        return {
          pid: parseInt(parts[1]) || 0,
          name: parts.slice(10).join(' ') || parts[10] || '',
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
          memoryBytes: (parseInt(parts[5]) || 0) * 1024,
          user: parts[0],
          status: parts[7] || '',
        };
      });
    }
  } catch {
    isMinimalContainer = true;
    return { unavailable: '极简容器环境不支持进程列表查询（无 ps 命令）' };
  }
}

export async function getPortList(): Promise<PortInfo[] | { unavailable: string }> {
  if (isMinimalContainer) {
    return { unavailable: '极简容器环境不支持端口列表查询（无 ss/netstat 命令）' };
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      const result = await Bun.$`powershell -Command "Get-NetTCPConnection -State Listen,Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess | ConvertTo-Json"`.quiet();
      const data = JSON.parse(result.stdout.toString());
      const connections = Array.isArray(data) ? data : [data];
      return connections.slice(0, 100).map(c => ({
        protocol: 'TCP',
        localAddress: c.LocalAddress,
        localPort: c.LocalPort,
        remoteAddress: c.RemoteAddress || '',
        remotePort: c.RemotePort || 0,
        state: c.State,
        pid: c.OwningProcess,
        processName: '',
      }));
    } else {
      const result = await Bun.$`ss -tuln 2>/dev/null | tail -n +2 | head -100 || netstat -tuln 2>/dev/null | tail -n +3 | head -100`.quiet();
      const lines = result.stdout.toString().trim().split('\n').filter(l => l);
      return lines.map(line => {
        const parts = line.split(/\s+/);
        const local = parts[4]?.split(':') || [];
        const remote = parts[5]?.split(':') || [];
        return {
          protocol: parts[0]?.toUpperCase() || '',
          localAddress: local.slice(0, -1).join(':') || '*',
          localPort: parseInt(local[local.length - 1]) || 0,
          remoteAddress: remote.slice(0, -1).join(':') || '*',
          remotePort: parseInt(remote[remote.length - 1]) || 0,
          state: parts[1] || '',
          pid: 0,
          processName: '',
        };
      });
    }
  } catch {
    isMinimalContainer = true;
    return { unavailable: '极简容器环境不支持端口列表查询（无 ss/netstat 命令）' };
  }
}

export async function killProcess(pid: number): Promise<boolean> {
  if (isMinimalContainer) {
    return false;
  }
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      await Bun.$`taskkill /PID ${pid} /F`.quiet();
    } else {
      await Bun.$`kill -9 ${pid}`.quiet();
    }
    return true;
  } catch {
    return false;
  }
}
