<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { systemConfigStore } from '@/lib/stores/system-config.svelte';
  import { t } from '@/lib/stores/i18n.svelte';

  const pageTitle = $derived(
    page.status === 404 ? t('page.error.pageNotFound') : t('page.error.title').replace('${status}', String(page.status))
  );
  const siteName = systemConfigStore.getSiteName();
</script>

<svelte:head>
  <title>{pageTitle} - {siteName}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-background px-4">
  <div class="text-center space-y-6">
    <div class="space-y-2">
      <h1 class="text-9xl font-bold text-muted-foreground/20">{page.status}</h1>
      <h2 class="text-2xl font-semibold tracking-tight">
        {#if page.status === 404}
          {t('page.error.pageNotFound')}
        {:else}
          {t('page.error.somethingWrong')}
        {/if}
      </h2>
      <p class="text-muted-foreground">
        {page.error?.message || t('page.error.defaultMessage')}
      </p>
    </div>

    <div class="flex items-center justify-center gap-4">
      <Button variant="outline" onclick={() => history.back()}>{t('page.error.goBack')}</Button>
      <Button onclick={() => goto('/')}>{t('page.error.goHome')}</Button>
    </div>
  </div>
</div>
