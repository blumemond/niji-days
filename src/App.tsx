import { CalendarDays, Copy, ExternalLink, Heart, Search, Share2, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { livers } from "./data/livers";
import { useFavorites } from "./hooks/useFavorites";
import { formatNumber, getEventsOnDate, getNextAnniversary, getPrimaryEvent, getUpcomingAnniversaries, calculateDayNumber } from "./lib/anniversaries";
import { formatDateJa, todayInJst } from "./lib/date";
import { sortLivers } from "./lib/sort";
import type { DecoratedAnniversaryEvent, Liver, SortDirection, SortKey } from "./types";

const TODAY = todayInJst();

export default function App() {
  const favorites = useFavorites();

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <CalendarDays aria-hidden="true" />
          <span>Niji Days</span>
        </Link>
        <nav className="site-nav" aria-label="メインナビゲーション">
          <NavLink to="/">トップ</NavLink>
          <NavLink to="/livers">ライバー一覧</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home favorites={favorites} />} />
          <Route path="/livers" element={<LiverList favorites={favorites} />} />
          <Route path="/livers/:id" element={<LiverDetail favorites={favorites} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>非公式ファンツールです。公式・運営会社とは関係ありません。</p>
        <Link to="/about">データ基準と権利方針</Link>
      </footer>
    </div>
  );
}

interface FavoriteState {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

function Home({ favorites }: { favorites: FavoriteState }) {
  const todayEvents = useMemo(() => getUpcomingAnniversaries(livers, TODAY, 0), []);
  const upcomingEvents = useMemo(() => getUpcomingAnniversaries(livers, TODAY, 30).filter((event) => event.daysUntil > 0), []);
  const favoriteLivers = livers.filter((liver) => favorites.favoriteIds.includes(liver.id));

  return (
    <div className="page-grid">
      <section className="hero-band">
        <div>
          <p className="eyebrow">今日 {formatDateJa(TODAY)}</p>
          <h1>推しの今日と、もうすぐ祝える日。</h1>
          <p>
            デビューからの活動日数、キリ番、周年をまとめて確認できます。データは公式プロフィール由来です。
          </p>
        </div>
        <Link className="primary-link" to="/livers">
          <Search aria-hidden="true" />
          ライバーを探す
        </Link>
      </section>

      <section className="section-block">
        <SectionHeader title="今日の記念日" description="周年、半周年、3桁以上のキリ番、特別キリ番を表示します。" />
        {todayEvents.length > 0 ? (
          <div className="card-grid">
            {todayEvents.map((event) => (
              <AnniversaryCard key={`${event.liverId}-${event.label}`} event={event} favorites={favorites} />
            ))}
          </div>
        ) : (
          <EmptyState text="今日の記念日に該当するライバーはいません。" />
        )}
      </section>

      <section className="section-block">
        <SectionHeader title="推し" description="ブラウザに保存されます。ログインは不要です。" />
        {favoriteLivers.length > 0 ? (
          <div className="card-grid">
            {favoriteLivers.slice(0, 6).map((liver) => (
              <LiverCard key={liver.id} liver={liver} favorites={favorites} />
            ))}
          </div>
        ) : (
          <EmptyState text="ライバー一覧や詳細ページから推し登録できます。" />
        )}
      </section>

      <section className="section-block">
        <SectionHeader title="近日記念日" description="今日から30日以内の節目を日付順で表示します。" />
        <div className="event-list">
          {upcomingEvents.slice(0, 12).map((event) => (
            <EventRow key={`${event.liverId}-${event.date}-${event.label}`} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LiverList({ favorites }: { favorites: FavoriteState }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("kana");
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [branch, setBranch] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showGraduated, setShowGraduated] = useState(true);

  const branches = useMemo(() => ["all", ...Array.from(new Set(livers.map((liver) => liver.branch)))], []);
  const filteredLivers = useMemo(() => {
    return sortLivers(
      livers.filter((liver) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchesQuery =
          !normalizedQuery ||
          liver.displayName.toLowerCase().includes(normalizedQuery) ||
          liver.displayNameKana.toLowerCase().includes(normalizedQuery);
        const matchesBranch = branch === "all" || liver.branch === branch;
        const matchesStatus = showGraduated || liver.status !== "graduated";
        const matchesFavorite = !showFavoritesOnly || favorites.isFavorite(liver.id);

        return matchesQuery && matchesBranch && matchesStatus && matchesFavorite;
      }),
      sortKey,
      direction,
      TODAY
    );
  }, [branch, direction, favorites, query, showFavoritesOnly, showGraduated, sortKey]);

  return (
    <div className="page-grid">
      <section className="toolbar-band" aria-label="ライバー検索と並び替え">
        <label className="search-field" htmlFor="liver-search">
          <Search aria-hidden="true" />
          <span className="sr-only">名前検索</span>
          <input
            id="liver-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="名前・よみで検索"
          />
        </label>

        <label htmlFor="liver-sort-key">
          並び替え
          <select id="liver-sort-key" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="kana">五十音順</option>
            <option value="debutDate">デビュー日順</option>
            <option value="dayNumber">経過日数</option>
            <option value="nextAnniversary">記念日が近い順</option>
          </select>
        </label>

        <label htmlFor="liver-sort-direction">
          方向
          <select
            id="liver-sort-direction"
            value={direction}
            onChange={(event) => setDirection(event.target.value as SortDirection)}
          >
            <option value="asc">昇順</option>
            <option value="desc">降順</option>
          </select>
        </label>

        <label htmlFor="liver-branch">
          区分
          <select id="liver-branch" value={branch} onChange={(event) => setBranch(event.target.value)}>
            {branches.map((branchName) => (
              <option key={branchName} value={branchName}>
                {branchName === "all" ? "すべて" : branchName}
              </option>
            ))}
          </select>
        </label>

        <label className="check-field" htmlFor="favorites-only">
          <input
            id="favorites-only"
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          推しのみ
        </label>
        <label className="check-field" htmlFor="show-graduated">
          <input
            id="show-graduated"
            type="checkbox"
            checked={showGraduated}
            onChange={(event) => setShowGraduated(event.target.checked)}
          />
          卒業済みを表示
        </label>
      </section>

      <section className="section-block">
        <SectionHeader title="ライバー一覧" description={`${filteredLivers.length}件を表示中`} />
        <div className="card-grid">
          {filteredLivers.map((liver) => (
            <LiverCard key={liver.id} liver={liver} favorites={favorites} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LiverDetail({ favorites }: { favorites: FavoriteState }) {
  const { id } = useParams();
  const liver = livers.find((item) => item.id === id);

  if (!liver) {
    return (
      <div className="page-grid">
        <EmptyState text="ライバーが見つかりませんでした。" />
      </div>
    );
  }

  const dayNumber = calculateDayNumber(liver.debutDate, TODAY);
  const todayEvents = getEventsOnDate(liver, TODAY);
  const nextEvents = getUpcomingAnniversaries([liver], TODAY, 180).slice(0, 8);
  const shareText = `今日は${liver.displayName}さんのデビューから${formatNumber(dayNumber)}日目です。\n${nextEvents[0] ? `次の${nextEvents[0].label}まであと${nextEvents[0].daysUntil}日。` : ""}\n\n#NijiDays`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="page-grid">
      <section className="detail-hero" style={{ borderColor: liver.color }}>
        <div>
          <p className="eyebrow">{liver.branch} / {liver.generationName}</p>
          <h1>{liver.displayName}</h1>
          <p className="day-number">今日で {formatNumber(dayNumber)}日目</p>
          <p>デビュー日: {formatDateJa(liver.debutDate)} / 基準: {liver.debutDateBasis}</p>
        </div>
        <FavoriteButton liver={liver} favorites={favorites} />
      </section>

      <section className="section-block">
        <SectionHeader title="今日の節目" description="複数ある場合は優先度順で表示します。" />
        {todayEvents.length > 0 ? (
          <div className="pill-row">
            {todayEvents.map((event) => (
              <span className="milestone-pill" key={event.label}>
                {event.label}
              </span>
            ))}
          </div>
        ) : (
          <EmptyState text="今日は節目に該当しません。" />
        )}
      </section>

      <section className="section-block">
        <SectionHeader title="近い節目" description="180日以内の主な記念日です。" />
        <div className="event-list">
          {nextEvents.map((event) => (
            <EventRow key={`${event.date}-${event.label}`} event={event} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="共有" description="投稿前に文面は編集できます。" />
        <div className="action-row">
          <a className="primary-link" href={shareUrl} target="_blank" rel="noreferrer">
            <Share2 aria-hidden="true" />
            Xで共有
          </a>
          <button className="icon-button with-label" type="button" onClick={() => navigator.clipboard.writeText(shareText)}>
            <Copy aria-hidden="true" />
            共有文をコピー
          </button>
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="公式リンク" description="公式プロフィールから取得したリンクです。" />
        <div className="link-list">
          {liver.links.map((link) => (
            <a className="external-link" href={link.url} key={`${link.type}-${link.url}`} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="データ根拠" description={liver.sourceNote} />
        <p className="muted">
          公式プロフィールのdebutAtをAsia/Tokyoの日付に変換しています。活動状態は公式サイト掲載情報のみでは断定しません。
        </p>
      </section>
    </div>
  );
}

function About() {
  return (
    <div className="page-grid">
      <section className="section-block readable">
        <h1>About</h1>
        <p>
          Niji Daysは、ライバーのデビュー日からの経過日数と近日記念日を確認するための非公式ファンツールです。
          公式・運営会社とは関係ありません。
        </p>
        <p>
          現在のアプリ内データは、にじさんじ公式サイトのタレント一覧と各タレント詳細ページから取得しています。
          デビュー日は公式プロフィールのdebutAtをAsia/Tokyoの日付に変換しています。
        </p>
        <ul>
          <li>公式画像・ロゴ・ライバー画像はMVPでは使用しません。</li>
          <li>日付計算はAsia/Tokyoの日付単位で扱います。</li>
          <li>推し登録はブラウザのlocalStorageに保存されます。</li>
        </ul>
      </section>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function AnniversaryCard({ event, favorites }: { event: DecoratedAnniversaryEvent; favorites: FavoriteState }) {
  return (
    <article className="liver-card highlighted" style={{ borderColor: event.liver.color }}>
      <div className="card-title-row">
        <span className="color-chip" style={{ background: event.liver.color }} />
        <h3>{event.liver.displayName}</h3>
        <FavoriteButton liver={event.liver} favorites={favorites} />
      </div>
      <p className="milestone-label">{event.label}</p>
      <p>今日で {formatNumber(event.dayNumber)}日目</p>
      <p>デビュー日: {formatDateJa(event.liver.debutDate)}</p>
      <Link className="text-link" to={`/livers/${event.liver.id}`}>
        詳細を見る
      </Link>
    </article>
  );
}

function LiverCard({ liver, favorites }: { liver: Liver; favorites: FavoriteState }) {
  const dayNumber = calculateDayNumber(liver.debutDate, TODAY);
  const nextEvent = getNextAnniversary(liver, TODAY);
  const todayEvents = getEventsOnDate(liver, TODAY);
  const primaryEvent = getPrimaryEvent(todayEvents);

  return (
    <article className="liver-card" style={{ borderColor: liver.color }}>
      <div className="card-title-row">
        <span className="color-chip" style={{ background: liver.color }} />
        <h3>{liver.displayName}</h3>
        <FavoriteButton liver={liver} favorites={favorites} />
      </div>
      {primaryEvent ? <p className="milestone-label">{primaryEvent.label}</p> : null}
      <p>デビュー日: {formatDateJa(liver.debutDate)}</p>
      <p>今日で: {formatNumber(dayNumber)}日目</p>
      <p>{nextEvent ? `次: ${nextEvent.label}まであと${nextEvent.daysUntil}日` : "次の節目を計算中"}</p>
      <p className="muted">{liver.branch} / {formatStatus(liver.status)}</p>
      <Link className="text-link" to={`/livers/${liver.id}`}>
        詳細を見る
      </Link>
    </article>
  );
}

function EventRow({ event }: { event: DecoratedAnniversaryEvent }) {
  return (
    <Link className="event-row" to={`/livers/${event.liver.id}`}>
      <span className="event-date">{formatDateJa(event.date)}</span>
      <span>{event.liver.displayName}</span>
      <strong>{event.label}</strong>
      <span>{event.daysUntil === 0 ? "今日" : `あと${event.daysUntil}日`}</span>
    </Link>
  );
}

function FavoriteButton({ liver, favorites }: { liver: Liver; favorites: FavoriteState }) {
  const active = favorites.isFavorite(liver.id);

  return (
    <button
      className={`icon-button ${active ? "is-active" : ""}`}
      type="button"
      onClick={() => favorites.toggleFavorite(liver.id)}
      aria-label={`${liver.displayName}を${active ? "推し解除" : "推し登録"}`}
      title={`${active ? "推し解除" : "推し登録"}`}
    >
      {active ? <Heart aria-hidden="true" fill="currentColor" /> : <Star aria-hidden="true" />}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

function formatStatus(status: Liver["status"]): string {
  switch (status) {
    case "active":
      return "活動中";
    case "graduated":
      return "卒業済み";
    case "paused":
      return "活動休止中";
    case "listed":
      return "公式掲載";
    default:
      return "公式掲載";
  }
}
