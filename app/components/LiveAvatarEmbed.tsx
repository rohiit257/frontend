'use client';
const LIVE_AVATAR_EMBED_URL =
  'https://embed.liveavatar.com/v1/0cb397c2-621a-4fce-9a1d-8b77c0844d17?orientation=vertical';

export default function LiveAvatarEmbed() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 bg-[var(--background)]/30 px-3 py-4 md:min-h-[520px] md:px-4">
      <p className="text-center text-xs font-medium text-[var(--muted)]">
        Need help? Talk with our AI assistant.
      </p>
      <div className="h-[min(520px,calc(100vh-220px))] min-h-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-black shadow-lg">
        <iframe
          src={LIVE_AVATAR_EMBED_URL}
          allow="microphone"
          title="LiveAvatar Embed"
          className="h-full max-h-full max-w-full border-0"
          style={{ aspectRatio: '9 / 16' }}
        />
      </div>
    </div>
  );
}
