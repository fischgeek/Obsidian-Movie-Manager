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
	posterUrl: string
}

export interface IGenre {
	id: number
	name: string
}

export interface IMediaDetail {
	id: number
	backdropUrl: string
	overview: string
	posterUrl: string
	releaseDate: Date
	runtime: number
	tagline: string
	title: string
	genres: IGenre[]
}