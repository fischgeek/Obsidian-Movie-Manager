import { request } from "obsidian"
import { IActor, IGenre, IMediaDetailBase, IMediaSearchResult, IMovieDetail, IProductionCompany, ISeason, ITVDetail, MediaType, MovieManagerSettings } from "interfaces"

const baseUrl = "https://api.themoviedb.org/3"

function getSizedImage (size: string, uri: string) {
	let posterBaseUrl = "https://image.tmdb.org/t/p"
	return `${posterBaseUrl}/${size}/${uri}`
}

function createSearchResultsList (res: any, mediaType: MediaType) {
	let resList = [] as IMediaSearchResult[]
	res.results.forEach( (mediaItem: any) => {
		let titleAttr = mediaItem.title
		if (mediaType == MediaType.TV) {
			titleAttr = mediaItem.name
		}
		let x : IMediaSearchResult = {
			id: mediaItem.id,
			title: titleAttr,
			overview: mediaItem.overview,
			posterUrl: getSizedImage("w200", mediaItem.poster_path)
		}
		resList.push(x)
	})
	return resList
}

function createMediaDetailResult (x: any, settings: MovieManagerSettings) {
	let genreList = [] as IGenre[]
	let castList = [] as IActor[]
	let prodList = [] as IProductionCompany[]
	x.genres.forEach( (genre: IGenre) =>
		genreList.push({id: genre.id, name: genre.name})
	)
	x.credits.cast.forEach( (actor: IActor) => {
		castList.push({id: actor.id, name: actor.name, character: actor.character})
	})
	castList = castList.slice(0, settings.castCount)
	x.production_companies.forEach( (company: IProductionCompany) => {
		prodList.push({id: company.id, name: company.name})
	})
	let title = x.title
	if (title === undefined && x.name != "") {
		title = x.name
	}
	let mdb : IMediaDetailBase = {
		id: x.id,
		backdropUrl: getSizedImage("original", x.backdrop_path),
		overview: x.overview,
		posterUrl: getSizedImage("w200", x.poster_path),
		releaseDate: x.release_date,
		runtime: x.runtime,
		tagline: x.tagline,
		title: title,
		genres: genreList,
		cast: castList,
		productionCompanies: prodList
	}
	return mdb
}

function createMovieDetails (x: any, settings: MovieManagerSettings) {
	let md : IMovieDetail = {
		mediaDetails: createMediaDetailResult(x, settings),
		collection: (x.belongs_to_collection == null ? "" : x.belongs_to_collection.name)
	}
	return md
}

function createTVDetails (tv: any, settings: MovieManagerSettings) {
	let seasonList = [] as ISeason[]
	tv.seasons.forEach( (x: any) => {
		seasonList.push({
			id: x.id, 
			airDate: x.first_air_date, 
			episodeCount: x.number_of_episodes,
			title: x.name,
			overview: x.overview,
			posterUrl: getSizedImage("w200", x.poster_path),
			season: x.season_number
		})
	})
	debugger
	let tvd : ITVDetail = {
		mediaDetails: createMediaDetailResult(tv, settings),
		episodeCount: 0,
		seasons: seasonList
	}
	return tvd
}

async function SearchMedia (title: string, mediaType: MediaType, settings: MovieManagerSettings) {
	console.log('searching for ' + title + " as " + mediaType.toString())
	console.log('using api key: ' + settings.apikey)

	let xurl = new URL(`${baseUrl}/search/${mediaType.toString()}`)
	xurl.searchParams.append("query", title)
	xurl.searchParams.append("language", "en-US")
	xurl.searchParams.append("page", "1")
	xurl.searchParams.append("include_adult", "false")
	xurl.searchParams.append("api_key", settings.apikey)

	console.log('url: ' + xurl)

	const resx = await request({
		url: xurl.href,
		method: 'get'
	})

	let resj = JSON.parse(resx)
	let resxx = createSearchResultsList(resj, mediaType)

	return resxx
}

export async function SearchMovie (title: string, settings: MovieManagerSettings) {
	return SearchMedia(title, MediaType.Movie, settings)
}

export async function SearchTV (title: string, settings: MovieManagerSettings) {
	return SearchMedia(title, MediaType.TV, settings)
}

async function GetMediaDetails (mediaId: number, settings: MovieManagerSettings, mediaType: MediaType) {
	console.log('searching for media by id ' + mediaId)
	console.log('using api key: ' + settings.apikey)

	let xurl = new URL(`${baseUrl}/${mediaType}/${mediaId}`)
	xurl.searchParams.append("append_to_response", "credits")
	xurl.searchParams.append("language", "en-US")
	xurl.searchParams.append("api_key", settings.apikey)

	console.log('url: ' + xurl)

	const resx = await request({
		url: xurl.href,
		method: 'get'
	})

	let resj = JSON.parse(resx)
	return resj
}

export async function GetMovieDetails (mediaId: number, settings: MovieManagerSettings) {
	let resj = await GetMediaDetails(mediaId, settings, MediaType.Movie)
	let movieDetail = createMovieDetails(resj, settings)
	return movieDetail
}

export async function GetTVDetails (mediaId: number, settings: MovieManagerSettings) {
	let resj = await GetMediaDetails(mediaId, settings, MediaType.TV)
	let tvDetail = createTVDetails(resj, settings)
	return tvDetail
}
