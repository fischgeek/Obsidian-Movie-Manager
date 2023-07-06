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
	defaultFormatsToTrue: boolean,
	formatList: string[]
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

export interface ISeason {
	id: number
	airDate: string
	episodeCount: number
	title: string
	overview: string
	posterUrl: string
	season: number
}

export interface IMediaDetailBase {
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
}

export interface IMovieDetail {
	mediaDetails: IMediaDetailBase
	collection: string
}

export interface ITVDetail {
	mediaDetails: IMediaDetailBase
	episodeCount: number
	seasons: ISeason[]	
}

export interface ConfirmFormats {
	selectedFormats: string[]
}
