import os from 'os';

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

function getMemoryInfo(): { total: number; used: number; free: number; usedPercent: number } {
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
    return { total: 0, used: 0, free: 0, usedPercent: 0 };
  }
}

async function getNetworkStats(): Promise<{ rx: number; tx: number }> {
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
    return { rx: 0, tx: 0 };
  }
}

export async function collectMetrics(): Promise<MetricsSnapshot> {
  const [diskInfo, network] = await Promise.all([
    getDiskInfo(),
    getNetworkStats(),
  ]);
  const memInfo = getMemoryInfo();

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
  const memInfo = getMemoryInfo();
  const interfaces = await getNetworkInterfaces();
  const swapInfo = await getSwapInfo();
  
  return {
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
}

async function getSwapInfo(): Promise<{ swapTotal: number; swapUsed: number; swapFree: number }> {
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
      const result = await Bun.$`free -b | grep Swap`.quiet();
      const parts = result.stdout.toString().trim().split(/\s+/);
      return {
        swapTotal: parseInt(parts[1]) || 0,
        swapUsed: parseInt(parts[2]) || 0,
        swapFree: parseInt(parts[3]) || 0,
      };
    }
  } catch {}
  return { swapTotal: 0, swapUsed: 0, swapFree: 0 };
}

async function getNetworkInterfaces(): Promise<NetworkInterface[]> {
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
      const result = await Bun.$`df -BT | grep -vE "^Filesystem|tmpfs|devtmpfs|overlay"`.quiet();
      const lines = result.stdout.toString().trim().split('\n');
      return lines.map(line => {
        const parts = line.split(/\s+/);
        const total = parseInt(parts[2]) || 0;
        const used = parseInt(parts[3]) || 0;
        const free = parseInt(parts[4]) || 0;
        return {
          name: parts[0],
          mountPoint: parts[6],
          fsType: parts[1],
          total,
          used,
          free,
          usedPercent: total > 0 ? Math.round((used / total) * 100 * 10) / 10 : 0,
        };
      });
    }
  } catch {
    return [];
  }
}

export async function getProcessList(sortBy: 'cpu' | 'memory' = 'cpu', limit = 20): Promise<ProcessInfo[]> {
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      // Use WMI to get CPU percentage (PerfFormattedData_PerfProc_Process)
      // Note: PercentProcessorTime can exceed 100% on multi-core systems, so we divide by core count if needed, 
      // or just cap it. Windows Task Manager shows per-process CPU usage relative to total capacity (0-100%).
      // We also get WorkingSetPrivate for memory to match Task Manager better.
      const cmd = `Get-CimInstance Win32_PerfFormattedData_PerfProc_Process | Sort-Object -Property PercentProcessorTime -Descending | Select-Object -First ${limit} IDProcess, Name, PercentProcessorTime, WorkingSetPrivate | ConvertTo-Json -Depth 2`;
      
      const result = await Bun.$`powershell -Command "${cmd}"`.quiet();
      const stdout = result.stdout.toString().trim();
      if (!stdout) return [];
      
      const data = JSON.parse(stdout);
      const processes = Array.isArray(data) ? data : [data];
      const totalMem = os.totalmem();
      const cpuCount = os.cpus().length;

      return processes
        .filter((p: any) => p.Name !== '_Total' && p.Name !== 'Idle')
        .map((p: any) => {
          // WMI PercentProcessorTime is already a percentage of total CPU capacity across all cores
          // But sometimes it can spike.
          const cpu = Number(p.PercentProcessorTime) || 0;
          // Scale down by cores if it seems to be per-core (WMI usually returns total system usage though)
          // Actually Win32_PerfFormattedData_PerfProc_Process.PercentProcessorTime is 0-100 * Cores in some versions?
          // No, usually it's 0-100 total. Let's assume standard behavior.
          // Wait, Task Manager shows 0-100%. If we have 16 cores and a process uses 1 core fully, it shows 6.25%.
          // If WMI returns 100 for 1 core usage, we need to divide by cpuCount.
          // Let's safe guard:
          const finalCpu = Math.round((cpu / cpuCount) * 10) / 10;
          
          const memBytes = Number(p.WorkingSetPrivate) || 0;
          const memPercent = totalMem > 0 ? Math.round((memBytes / totalMem) * 100 * 10) / 10 : 0;

          return {
            pid: p.IDProcess,
            name: p.Name,
            cpu: finalCpu,
            memory: memPercent,
            memoryBytes: memBytes,
            user: '',
            status: 'running',
          };
        });
    } else {
      const sortFlag = sortBy === 'cpu' ? '-pcpu' : '-pmem';
      const result = await Bun.$`ps aux --sort=${sortFlag} | head -${limit + 1} | tail -${limit}`.quiet();
      const lines = result.stdout.toString().trim().split('\n');
      return lines.map(line => {
        const parts = line.split(/\s+/);
        return {
          pid: parseInt(parts[1]) || 0,
          name: parts[10] || '',
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
          memoryBytes: parseInt(parts[5]) * 1024 || 0,
          user: parts[0],
          status: parts[7] || '',
        };
      });
    }
  } catch {
    return [];
  }
}

export async function getPortList(): Promise<PortInfo[]> {
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
      const result = await Bun.$`ss -tuln | tail -n +2 | head -100`.quiet();
      const lines = result.stdout.toString().trim().split('\n');
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
    return [];
  }
}

export async function killProcess(pid: number): Promise<boolean> {
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
