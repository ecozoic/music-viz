type SpotifyObject = {
  external_urls: Readonly<{
    spotify: string;
  }>;
  href: string;
  id: string;
  uri: string;
  type: 'album' | 'artist' | 'track' | 'user';
};

type SpotifyImages = Readonly<{
  images: ReadonlyArray<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
}>;

type SpotifyFollowers = Readonly<{
  followers: Readonly<{
    href: string | null;
    total: number;
  }>;
}>;

type SpotifyExternalIDs = Readonly<{
  external_ids: Readonly<{
    isrc: string;
    ean: string;
    upc: string;
  }>;
}>;

type SpotifyRestrictions = Readonly<{
  restrictions: Readonly<{
    reason: 'market' | 'product' | 'explicit';
  }>;
}>;

type SpotifyAvailableMarkets = Readonly<{
  available_markets: ReadonlyArray<string>;
}>;

type SpotifyName = Readonly<{
  name: string;
}>;

type SpotifyGenres = Readonly<{
  genres: ReadonlyArray<string>;
}>;

type SpotifyPopularity = Readonly<{
  popularity: number;
}>;

type Me = SpotifyObject &
  SpotifyImages &
  SpotifyFollowers &
  Readonly<{
    country: string;
    display_name: string;
    email: string;
    explicit_content: Readonly<{
      filter_enabled: boolean;
      filter_locked: boolean;
    }>;
    product: string;
    type: 'user';
  }>;

type SimplifiedArtist = SpotifyObject &
  SpotifyName &
  Readonly<{
    type: 'artist';
  }>;

export type Artist = SimplifiedArtist &
  SpotifyImages &
  SpotifyFollowers &
  SpotifyGenres &
  SpotifyPopularity;

type SimplifiedAlbum = SpotifyObject &
  SpotifyAvailableMarkets &
  SpotifyImages &
  SpotifyName &
  SpotifyRestrictions &
  Readonly<{
    album_type: 'album' | 'single' | 'compilation';
    total_tracks: number;
    release_date: string;
    release_date_precision: 'year' | 'month' | 'day';
    type: 'album';
    artists: ReadonlyArray<SimplifiedArtist>;
  }>;

export type Album = SimplifiedAlbum &
  SpotifyExternalIDs &
  SpotifyGenres &
  SpotifyPopularity &
  Readonly<{
    tracks: Page<SimplifiedTrack>;
    copyrights: ReadonlyArray<{
      text: string;
      type: string;
    }>;
    label: string;
  }>;

type BaseTrack = SpotifyObject &
  SpotifyRestrictions &
  SpotifyAvailableMarkets &
  SpotifyName &
  Readonly<{
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    is_playable: boolean;
    linked_from: SpotifyObject &
      Readonly<{
        type: 'track';
      }>;
    preview_url: string | null;
    track_number: number;
    type: 'track';
    is_local: boolean;
  }>;

type SimplifiedTrack = BaseTrack &
  Readonly<{
    artists: ReadonlyArray<SimplifiedArtist>;
  }>;

export type Track = BaseTrack &
  SpotifyExternalIDs &
  SpotifyPopularity &
  Readonly<{
    album: Album;
    artists: ReadonlyArray<Artist>;
  }>;

type Page<T> = Readonly<{
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: ReadonlyArray<T>;
}>;

type SearchResults = Readonly<{
  tracks: Page<Track>;
  artists: Page<Artist>;
  albums: Readonly<{}>;
}>;

export default class SpotifyClient {
  readonly #urlMap = {
    me: 'https://api.spotify.com/v1/me',
    artistByID: 'https://api.spotify.com/v1/artists/{id}',
    albumsByArtistID: 'https://api.spotify.com/v1/artists/{id}/albums',
    albumByID: 'https://api.spotify.com/v1/albums/{id}',
    tracksByAlbumID: 'https://api.spotify.com/v1/albums/{id}/tracks',
    trackByID: 'https://api.spotify.com/v1/tracks/{id}',
    search: 'https://api.spotify.com/v1/search',
  };

  readonly #getAccessToken: () => string | null;
  readonly #getAccessTokenExpiration: () => number | null;
  readonly #refreshToken: () => Promise<unknown>;

  constructor(
    getAccessToken: () => string | null,
    getAccessTokenExpiration: () => number | null,
    refreshToken: () => Promise<unknown>,
  ) {
    this.#getAccessToken = getAccessToken;
    this.#getAccessTokenExpiration = getAccessTokenExpiration;
    this.#refreshToken = refreshToken;
  }

  async #get(url: URL): Promise<unknown> {
    if (this.#isAccessTokenExpired()) {
      await this.#refreshToken();
    }
    const accessToken = this.#getAccessToken()!;
    const params: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await window.fetch(url, params);
    return response.json();
  }

  #replaceIdToken(url: string, id: string): string {
    return url.replace('{id}', id);
  }

  #isAccessTokenExpired(): boolean {
    return Date.now() > this.#getAccessTokenExpiration()!;
  }

  async me(): Promise<Me> {
    return this.#get(new URL(this.#urlMap.me)) as Promise<Me>;
  }

  async search(
    query: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<SearchResults> {
    const params = {
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      types: ['album', 'artist'].join(','),
    };
    const url = new URL(this.#urlMap.search);
    url.search = new URLSearchParams(params).toString();
    return this.#get(url) as Promise<SearchResults>;
  }

  async artistByID(id: string): Promise<Artist> {
    const url = new URL(this.#replaceIdToken(this.#urlMap.artistByID, id));
    return this.#get(url) as Promise<Artist>;
  }

  async albumsByArtistID(
    id: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Page<SimplifiedAlbum>> {
    const url = new URL(
      this.#replaceIdToken(this.#urlMap.albumsByArtistID, id),
    );
    const params = {
      include_groups: 'album',
      limit: limit.toString(),
      offset: offset.toString(),
    };
    url.search = new URLSearchParams(params).toString();
    return this.#get(url) as Promise<Page<SimplifiedAlbum>>;
  }

  async albumByID(id: string): Promise<Album> {
    const url = new URL(this.#replaceIdToken(this.#urlMap.albumByID, id));
    return this.#get(url) as Promise<Album>;
  }

  async tracksByAlbumID(
    id: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Page<SimplifiedTrack>> {
    const url = new URL(this.#replaceIdToken(this.#urlMap.tracksByAlbumID, id));
    const params = {
      limit: limit.toString(),
      offset: offset.toString(),
    };
    url.search = new URLSearchParams(params).toString();
    return this.#get(url) as Promise<Page<SimplifiedTrack>>;
  }

  async trackByID(id: string): Promise<Track> {
    const url = new URL(this.#replaceIdToken(this.#urlMap.trackByID, id));
    return this.#get(url) as Promise<Track>;
  }
}
