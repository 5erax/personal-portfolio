import * as React from 'react';

export type MusicTrack = { title: string; artist: string; src: string; artwork: string };

export function useAudioPlayer(song: MusicTrack) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [buffering, setBuffering] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [repeat, setRepeat] = React.useState(true);
  const [error, setError] = React.useState('');

  const play = React.useCallback(() => {
    const media = audio.current;
    if (!media) return;
    setError('');
    if (media.error) media.load();
    // Safari requires play() directly inside the tap handler.
    void media.play().catch(() => {
      setBuffering(false);
      setError('Không thể phát nhạc. Chạm Phát để thử lại.');
    });
  }, []);
  const stop = React.useCallback(() => audio.current?.pause(), []);
  const seek = React.useCallback((seconds: number) => {
    const media = audio.current;
    if (!media || !Number.isFinite(media.duration) || media.duration <= 0) return;
    media.currentTime = Math.max(0, Math.min(media.duration, seconds));
    setTime(media.currentTime);
  }, []);

  React.useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const session = navigator.mediaSession;
    if (typeof MediaMetadata !== 'undefined') {
      session.metadata = new MediaMetadata({ title: song.title, artist: song.artist, album: 'Astraa’s desktop', artwork: [{ src: song.artwork, type: 'image/jpeg' }] });
    }
    const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
      play, pause: stop,
      seekbackward: details => seek((audio.current?.currentTime ?? 0) - (details.seekOffset ?? 15)),
      seekforward: details => seek((audio.current?.currentTime ?? 0) + (details.seekOffset ?? 15)),
      seekto: details => { if (details.seekTime !== undefined) seek(details.seekTime); },
    };
    for (const [action, handler] of Object.entries(handlers)) {
      try { session.setActionHandler(action as MediaSessionAction, handler); } catch { /* Optional actions vary by Safari version. */ }
    }
    return () => {
      for (const action of Object.keys(handlers)) {
        try { session.setActionHandler(action as MediaSessionAction, null); } catch { /* Unsupported action. */ }
      }
      session.metadata = null;
      session.playbackState = 'none';
    };
  }, [song.title, song.artist, song.artwork, play, stop, seek]);

  React.useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    if (duration > 0 && Number.isFinite(duration) && navigator.mediaSession.setPositionState) {
      try { navigator.mediaSession.setPositionState({ duration, playbackRate: 1, position: Math.min(time, duration) }); } catch { /* Position reporting is optional. */ }
    }
  }, [playing, time, duration]);

  const element = <audio ref={audio} src={song.src} preload="metadata" loop={repeat}
    onPlay={() => setPlaying(true)} onPlaying={() => setBuffering(false)}
    onPause={() => { setPlaying(false); setBuffering(false); }}
    onWaiting={() => setBuffering(true)}
    onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
    onDurationChange={event => setDuration(event.currentTarget.duration)}
    onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
    onEnded={() => setPlaying(false)}
    onError={() => { setPlaying(false); setBuffering(false); setError('Không tải được bài hát. Kiểm tra kết nối và thử lại.'); }} />;
  return { element, playing, buffering, time, duration, repeat, setRepeat, error, play, stop, seek };
}

const formatTime = (seconds: number) => {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
};

export function MusicPlayer({ player, song }: { player: ReturnType<typeof useAudioPlayer>; song: MusicTrack }) {
  const { playing, buffering, time, duration, repeat, setRepeat, error, play, stop, seek } = player;
  const ready = Number.isFinite(duration) && duration > 0;
  return <section className="mp-player" aria-label="Music player">
    <div className="mp-heading"><span>NOW PLAYING</span><span aria-hidden="true">♫</span></div>
    <img className={'mp-cover' + (playing ? ' is-playing' : '')} src={song.artwork} alt="Autumn mountains in Minecraft" />
    <div className="mp-track"><div><h2>{song.title}</h2><p>{song.artist}</p></div>
      <button className="mp-repeat" type="button" aria-label="Repeat song" aria-pressed={repeat} onClick={() => setRepeat(!repeat)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 4l3 3-3 3M21 7H7a4 4 0 0 0-4 4M6 20l-3-3 3-3M3 17h14a4 4 0 0 0 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
    <label className="mp-timeline"><span className="mp-sr-only">Seek through song</span>
      <input type="range" min="0" max={ready ? duration : 1} step="0.1" value={ready ? Math.min(time, duration) : 0} disabled={!ready}
        onChange={event => seek(Number(event.target.value))} aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`} />
    </label>
    <div className="mp-times"><span>{formatTime(time)}</span><span>−{formatTime(duration - time)}</span></div>
    <div className="mp-controls">
      <button type="button" aria-label="Back 15 seconds" disabled={!ready} onClick={() => seek(time - 15)}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 9a11 11 0 1 1-3 9M9 3v7H2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><text x="16" y="22" textAnchor="middle" fontSize="11" fill="currentColor">15</text></svg></button>
      <button className="mp-play" type="button" aria-label={playing ? 'Pause music' : 'Play music'} onClick={playing ? stop : play}>
        <svg viewBox="0 0 32 32" aria-hidden="true">{playing ? <path d="M9 6h5v20H9zM18 6h5v20h-5z" fill="currentColor" /> : <path d="M10 5v22l18-11z" fill="currentColor" />}</svg>
      </button>
      <button type="button" aria-label="Forward 15 seconds" disabled={!ready} onClick={() => seek(time + 15)}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M23 9a11 11 0 1 0 3 9M23 3v7h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><text x="16" y="22" textAnchor="middle" fontSize="11" fill="currentColor">15</text></svg></button>
    </div>
    <p className="mp-status" role="status">{buffering ? 'Đang tải nhạc…' : playing ? 'Đang phát · Dùng nút âm lượng trên thiết bị' : 'Chạm Phát để nghe nhạc'}</p>
    {error && <p className="mp-error" role="alert">{error}</p>}
  </section>;
}
