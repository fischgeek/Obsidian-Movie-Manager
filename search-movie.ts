import { request } from "obsidian"
import { IMovieSearchResult } from "interfaces"

const baseUrl = "https://api.themoviedb.org/3"

function getSizedImage (size: string, uri: string) {
	let posterBaseUrl = "https://image.tmdb.org/t/p"
	return `${posterBaseUrl}/${size}/${uri}`
}

function createSearchResultsList (res: any) {
	let resList = [] as IMovieSearchResult[]
	res.results.forEach( (movieResult: any) => {
		console.log('movie id: ' + movieResult.id)
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

export async function SearchMovie (title: string, apikey: string) {
	console.log('searching for ' + title)

	let xurl = new URL(baseUrl + "/search/movie")
	xurl.searchParams.append("query", title)
	xurl.searchParams.append("language", "en-US")
	xurl.searchParams.append("page", "1")
	xurl.searchParams.append("include_adult", "false")
	xurl.searchParams.append("api_key", apikey)

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

export async function GetMovieDetails (movieId: number, apikey: string) {
	console.log('searching for movie by id ' + movieId)

	let xurl = new URL(`${baseUrl}/movie/${movieId}`)
	xurl.searchParams.append("append_to_response", "credits")
	xurl.searchParams.append("language", "en-US")
	xurl.searchParams.append("api_key", apikey)

	console.log('url: ' + xurl)

	const resx = await request({
		url: xurl.href,
		method: 'get'
	})

	let resj = JSON.parse(resx)

	console.log(resj)

	// let resxx = createSearchResultsList(resj)

	return ""
}