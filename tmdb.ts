import { request } from "obsidian"
import { IActor, IGenre, IMediaDetail, IMovieSearchResult, IProductionCompany, MovieManagerSettings } from "interfaces"

const baseUrl = "https://api.themoviedb.org/3"

function getSizedImage (size: string, uri: string) {
	let posterBaseUrl = "https://image.tmdb.org/t/p"
	return `${posterBaseUrl}/${size}/${uri}`
}

function createSearchResultsList (res: any) {
	let resList = [] as IMovieSearchResult[]
	res.results.forEach( (movieResult: any) => {
		// console.log('movie id: ' + movieResult.id)
		// let mr = new MovieSearchResult(movieResult.id, movieResult.title, movieResult.overview)
		let x : IMovieSearchResult = {
			id: movieResult.id,
			title: movieResult.title, 
			overview: movieResult.overview,
			posterUrl: getSizedImage("w200", movieResult.poster_path)
		}
		resList.push(x)
	})
	return resList
}

function createMediaResultList (x: any) {
	let genreList = [] as IGenre[]
	let castList = [] as IActor[]
	let prodList = [] as IProductionCompany[]
	x.genres.forEach( (genre: IGenre) =>
		genreList.push({id: genre.id, name: genre.name})
	)
	x.credits.cast.forEach( (actor: IActor) => {
		castList.push({id: actor.id, name: actor.name, character: actor.character})
	})
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
		productionCompanies: prodList
	}
	return md
}

export async function SearchMovie (title: string, settings: MovieManagerSettings) {
	console.log('searching for ' + title)
	// debugger
	console.log('using api key: ' + settings.apikey)

	let xurl = new URL(baseUrl + "/search/movie")
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

	console.log(resj)

	let resxx = createSearchResultsList(resj)

	return resxx
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

	let resxx = createMediaResultList(resj)

	return resxx
}
