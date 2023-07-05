import { IActor, IGenre, IKeyValuePair, IMovieSearchResult, IProductionCompany, MovieManagerSettings } from "interfaces"
import { Notice } from "obsidian"
import { GetMovieDetails } from "tmdb"

function truncate (s: string, max: number) {
	return s.substring(0, max)
}
export function truncate250 (s: string) {
	return truncate(s, 250)
}
function makeTagString (items: string[]) {
	let str = ""
	items.forEach((item: string) => {
		let g = item.replace(" ", "")
		str += `#${g} `
	})
	return str
}
function makeGenreTagString (genres: IGenre[]) {
	return makeTagString(genres.map(genre => {return genre.name}))
}
let removeThe = (title: string) => {
	let hasThe = title.substring(0,3).toLowerCase() == "the"
	if (hasThe) {
		return title.substring(3).trim()
	}
	return title
}
let xrn = (str:string) => { return `${str}\r\n` }
let xrnrn = (str:string) => { return `${str}\r\n\r\n` }
let rnx = (str:string) => { return `\r\n${str}` }
let rnrnx = (str:string) => { return `\r\n\r\n${str}` }



export async function WriteMediaToFile (movie: IMovieSearchResult, settings: MovieManagerSettings, formatList: string[]) {
	new Notice(`Selected ${movie.title}`)
	console.log('selected movie id: ' + movie.id)
	let movieDetail = await GetMovieDetails(movie.id, settings)
	let fileName = movieDetail.title + ".md"
	let adapter = app.vault.adapter

	let addMeta = () => {
		let kvpairList = [] as IKeyValuePair[]
		app.vault.adapter.write(fileName, "")
		if (settings.useBanner) {
			kvpairList.push({key: "banner", value: movieDetail.backdropUrl})
		}
		if (settings.addMeta) {
			kvpairList.push({key: "id", value: movieDetail.id.toString()})
			kvpairList.push({key: "year", value: movieDetail.releaseDate})
		}
		if (settings.addSortTitle) {
			let sortTitle = movieDetail.title.toLowerCase()
			if (settings.ignoreThe) {
				sortTitle = removeThe(sortTitle)
			}
			kvpairList.push({key: "sort-title", value: sortTitle})
		}
		adapter.append(fileName, xrn("---"))
		kvpairList.forEach(kvp => {
			adapter.append(fileName, xrn(`${kvp.key}: '${kvp.value}'`))
		})
		adapter.append(fileName, xrn("---"))
	}
	let addGenres = () => {
		adapter.append(fileName, xrnrn(makeGenreTagString(movieDetail.genres)))
	}
	let addPoster = () => {
		adapter.append(fileName, xrn(`![](${movieDetail.posterUrl})`))
	}
	let addOverview = () => {
		adapter.append(fileName, xrn(`${movieDetail.overview}`))
	}
	let addCollection = () => {
		if (settings.showCollections) {
			adapter.append(fileName, xrn("## Collection"))
			adapter.append(fileName, xrn(`[[${movieDetail.collection}]]`))
		}
	}
	let addCast = () => {
		if (settings.showCast) {
			adapter.append(fileName, xrn("## Cast"))
			movieDetail.cast.forEach( (actor: IActor) => {
				adapter.append(fileName, xrn(`[[${actor.name}]] ${actor.character}`))
			})
		}
	}
	let addProductionCompanies = () => {
		if (settings.showProductionCompanies) {
			adapter.append(fileName, xrn("## Production Companies"))
			movieDetail.productionCompanies.forEach( (pc: IProductionCompany) => {
				adapter.append(fileName, `[[${pc.name}]] | `)
			})
		}
	}
	let addFormats = () => {
		if (settings.showOwnedFormats && formatList.length > 0 && formatList[0] != "") {
			adapter.append(fileName, rnx(xrn("## Formats")))
			adapter.append(fileName, xrn(makeTagString(formatList)))
		}
	}

	addMeta()
	addGenres()
	addPoster()
	addOverview()
	addCollection()
  addCast()
  addProductionCompanies()
  addFormats()
	
}

