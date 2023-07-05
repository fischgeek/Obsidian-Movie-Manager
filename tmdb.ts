import { request } from "obsidian"
import { IActor, IGenre, IMediaDetail, IMediaSearchResult, IProductionCompany, MediaType, MovieManagerSettings } from "interfaces"

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

function createMediaDetailResultList (x: any, settings: MovieManagerSettings, mediaType: MediaType) {
	// FIX THIS TO HANDLE MEDIA TYPES!
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
	let md : IMediaDetail = {
		id: x.id,
		backdropUrl: getSizedImage("original", x.backdrop_path),
		overview: x.overview,
		posterUrl: getSizedImage("w200", x.poster_path),
		releaseDate: x.release_date,
		runtime: x.runtime,
		tagline: x.tagline,
		title: x.title,
		genres: genreList,
		cast: castList,
		productionCompanies: prodList,
		collection: x.belongs_to_collection.name
	}
	return md
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

export async function GetMovieDetails (movieId: number, settings: MovieManagerSettings) {
	console.log('searching for movie by id ' + movieId)
	console.log('using api key: ' + settings.apikey)

	let xurl = new URL(`${baseUrl}/movie/${movieId}`)
	xurl.searchParams.append("append_to_response", "credits")
	xurl.searchParams.append("language", "en-US")
	xurl.searchParams.append("api_key", settings.apikey)

	console.log('url: ' + xurl)

	const resx = await request({
		url: xurl.href,
		method: 'get'
	})

	let resj = JSON.parse(resx)

	console.log(resj)

	let resxx = createMediaResultList(resj, settings)

	return resxx
}
