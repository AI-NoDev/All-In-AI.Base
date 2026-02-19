<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    src: string;
    duration?: number;
    class?: string;
  }

  let { src, duration = 0, class: className = '' }: Props = $props();

  let audioRef = $state<HTMLAudioElement | null>(null);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let audioDuration = $state(0);

  $effect(() => {
    audioDuration = duration;
  });

  function togglePlay() {
    if (!audioRef) return;
    
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
  }

  function handlePlay() {
    isPlaying = true;
  }

  function handlePause() {
    isPlaying = false;
  }

  function handleEnded() {
    isPlaying = false;
    currentTime = 0;
  }

  function handleTimeUpdate() {
    if (audioRef) {
      currentTime = audioRef.currentTime;
    }
  }

  function handleLoadedMetadata() {
    if (audioRef && audioRef.duration && isFinite(audioRef.duration)) {
      audioDuration = audioRef.duration;
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<button
  type="button"
  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer {className}"
  onclick={togglePlay}
>
  <!-- 语音波形图标（WiFi 样式旋转 90 度） -->
  <div class="voice-icon relative w-4 h-4 flex items-center justify-center" class:playing={isPlaying}>
    {#if isPlaying}
      <!-- 播放中：动态波形 -->
      <div class="voice-waves flex items-end gap-0.5 h-3.5 rotate-90">
        <span class="wave wave-1 w-0.5 bg-primary rounded-full"></span>
        <span class="wave wave-2 w-0.5 bg-primary rounded-full"></span>
        <span class="wave wave-3 w-0.5 bg-primary rounded-full"></span>
      </div>
    {:else}
      <!-- 暂停：静态图标 -->
      <Icon icon="mdi:volume-high" class="size-4 text-primary" />
    {/if}
  </div>
  
  <!-- 时长显示 -->
  <span class="text-xs text-foreground/80 min-w-[2.5rem]">
    {#if isPlaying}
      {formatTime(currentTime)}
    {:else}
      {formatTime(audioDuration)}
    {/if}
  </span>
</button>

<!-- 隐藏的 audio 元素 -->
<audio
  bind:this={audioRef}
  {src}
  onplay={handlePlay}
  onpause={handlePause}
  onended={handleEnded}
  ontimeupdate={handleTimeUpdate}
  onloadedmetadata={handleLoadedMetadata}
  preload="metadata"
></audio>

<style>
  .voice-waves .wave {
    animation: wave-animation 1s ease-in-out infinite;
  }
  
  .wave-1 {
    height: 40%;
    animation-delay: 0s;
  }
  
  .wave-2 {
    height: 70%;
    animation-delay: 0.15s;
  }
  
  .wave-3 {
    height: 100%;
    animation-delay: 0.3s;
  }
  
  @keyframes wave-animation {
    0%, 100% {
      transform: scaleY(0.4);
    }
    50% {
      transform: scaleY(1);
    }
  }
</style>
