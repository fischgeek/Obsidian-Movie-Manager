import { request } from "obsidian"
import { MovieSearchResult } from 'classes'

function createSearchResultsList (res: any) {
	let resList = [] as MovieSearchResult[]
	res.results.forEach( (movieResult: any) => {
		console.log('movie id: ' + movieResult.id)
		let mr = new MovieSearchResult(movieResult.id, movieResult.title, movieResult.overview)
		resList.push(mr)
	})
	return resList
}

export async function SearchMovie (title: string, apikey: string) {
	console.log('searching for ' + title)
	const baseUrl = "https://api.themoviedb.org/3"
	const auth = `api_key=${apikey}&language=en-US&page=1&include_adult=false`

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
