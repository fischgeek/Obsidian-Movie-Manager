export interface MovieManagerSettings {
	apikey: string
	maxResults: number
	useBanner: boolean
	addMeta: boolean
	addSortTitle: boolean
	ignoreThe: boolean
	showCollections: boolean
	createCollectionFile: boolean
	showCast: boolean
	castCount: number
	showProductionCompanies: boolean
	formats: string[]
	showOwnedFormats: boolean,
	defaultFormatsToTrue: boolean
}

export interface IKeyValuePair {
	key: string
	value: string
}

export enum MediaType {
	Movie = "movie",
	TV = "tv",
	Collection = "collection"
}

export interface IMediaSearchResult {
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
	releaseDate: string
	runtime: number
	tagline: string
	title: string
	genres: IGenre[]
	cast: IActor[]
	productionCompanies: IProductionCompany[]
	collection: string
}

export interface ITVDetail {
	id: number
	backdropUrl: string
	overview: string
	posterUrl: string
	releaseDate: string
	tagline: string
	title: string
	genres: IGenre[]
	cast: IActor[]
	productionCompanies: IProductionCompany[]
	seasons: any
	episodeCount: number
}

export interface ConfirmFormats {
	selectedFormats: string[]
}
