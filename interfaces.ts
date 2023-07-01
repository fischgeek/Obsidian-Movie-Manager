export interface MovieManagerSettings {
	apikey: string;
	maxResults: number;
}

export interface IBook {
	title: string;
	author: string;
}

export interface IMovieSearchResult {
	id: number
	title: string
	overview: string
}