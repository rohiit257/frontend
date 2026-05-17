'use client';

const LIVE_AVATAR_EMBED_URL =
  'https://embed.liveavatar.com/v1/a763c2c7-397c-4f86-86db-1db2d08b5e74?orientation=horizontal';

export default function LiveAvatarEmbed() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex' }}>
      <iframe
        src={LIVE_AVATAR_EMBED_URL}
        allow="microphone"
        title="LiveAvatar Embed"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          aspectRatio: '16/9',
        }}
      />
    </div>
  );
}
