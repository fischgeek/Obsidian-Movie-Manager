export interface MovieManagerSettings {
	apikey: string
	maxResults: number
	useBanner: boolean
	showCast: boolean
	showProductionCompanies: boolean
	formats: string[]
	showOwnedFormats: boolean
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

export interface IActor {
	id: number,
	name: string,
	character: string,
}

export interface IProductionCompany {
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
	cast: IActor[]
	productionCompanies: IProductionCompany[]
}

export interface ConfirmFormats {
	selectedFormats: string[]
}
