import { IActor, IGenre, IKeyValuePair, IMediaDetailBase, IMediaSearchResult, IMovieDetail, IProductionCompany, ISeason, ITVDetail, MediaType, MovieManagerSettings } from "interfaces"
import { Notice, TFile } from "obsidian"
import * as path from "path"
import { DEFAULT_SETTINGS } from "settings"
import { GetMovieDetails, GetTVDetails } from "tmdb"

let adapter = app.vault.adapter
let _fileName = ""
let _mediaDetailBase : IMediaDetailBase
let _settings : MovieManagerSettings

export function getFrontmatter (filePath: string) {
	let metadata = app.metadataCache.getCache(filePath)
		let fm = metadata?.frontmatter
		if (fm) {
			return metadata!.frontmatter!
		}
		return null
}
function getMediaFileCount(mediaType: MediaType) {
	let files = app.vault.getMarkdownFiles()
	let mediaCount = 0;
	files.forEach((f: TFile) => {
		let meta = getFrontmatter(f.path)
		if (meta && meta.media_type == mediaType) {
			mediaCount++
		}
	})
	return mediaCount
}
async function getMovieFileCount () {
	return getMediaFileCount(MediaType.Movie)
}
async function getTVFileCount () {
	return getMediaFileCount(MediaType.TV)
}
export async function getMovieStatusBarText () {
	const mfc = await getMovieFileCount()
	const msuffix = mfc == 1 ? "" : "s"
	return `${mfc} movie${msuffix}`
}
export async function getTVStatusBarText () {
	const tvfc = await getTVFileCount()
	const tvsuffix = tvfc == 1 ? "" : "s"
	return `${tvfc} show${tvsuffix}`
}
let removeInvalidChars = (fileNameWithoutExt: string) => {
	return fileNameWithoutExt.replace(/[/\\?%*:|"<>]/g, "")
}
let handleDuplicateFiles = async (media: IMediaDetailBase) => {
	let fileNameWithExt = removeInvalidChars(media.title) + ".md"
	let fileNameWithoutExt = fileNameWithExt.substring(0, fileNameWithExt.length-3)
	let outName = fileNameWithExt
	if (await adapter.exists(fileNameWithExt)) {
		let fm = getFrontmatter(fileNameWithExt)
		if (fm && fm.id != media.id) {
		 	outName = `${fileNameWithoutExt} (${media.releaseDate.substring(0, 4)}).md`
		}
	}
	return outName
}
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

let addMeta = (mediaType: MediaType) => {
	let kvpairList = [] as IKeyValuePair[]
	app.vault.adapter.write(_fileName, "")
	if (_settings.useBanner) {
		kvpairList.push({key: "banner", value: _mediaDetailBase.backdropUrl})
	}
	if (_settings.addMeta) {
		kvpairList.push({key: "id", value: _mediaDetailBase.id.toString()})
		kvpairList.push({key: "year", value: _mediaDetailBase.releaseDate})
		kvpairList.push({key: "media_type", value: mediaType})
		kvpairList.push({key: "search_title", value: _mediaDetailBase.title})
	}
	if (_settings.addSortTitle) {
		let sortTitle = _mediaDetailBase.title.toLowerCase()
		if (_settings.ignoreThe) {
			sortTitle = removeThe(sortTitle)
		}
		kvpairList.push({key: "sort_title", value: sortTitle})
	}
	adapter.append(_fileName, xrn("---"))
	kvpairList.forEach(kvp => {
		adapter.append(_fileName, xrn(`${kvp.key}: '${kvp.value}'`))
	})
	adapter.append(_fileName, xrn("---"))
}
let addGenres = () => {
	adapter.append(_fileName, xrnrn(makeGenreTagString(_mediaDetailBase.genres)))
}
let addPoster = () => {
	adapter.append(_fileName, xrn(`![](${_mediaDetailBase.posterUrl})`))
}
let addOverview = () => {
	adapter.append(_fileName, xrn(`${_mediaDetailBase.overview}`))
}
let addCollection = (collection: string) => {
	if (_settings.showCollections && collection != "") {
		adapter.append(_fileName, xrn("## Collection"))
		adapter.append(_fileName, xrn(`[[${collection}]]`))
	}
}
let addCast = () => {
	if (_settings.showCast) {
		adapter.append(_fileName, xrn("## Cast"))
		_mediaDetailBase.cast.forEach( (actor: IActor) => {
			adapter.append(_fileName, xrn(`[[${actor.name}]] ${actor.character}`))
		})
	}
}
let addSeasons = (seasons: ISeason[]) => {
	if (_settings.showProductionCompanies) {
		adapter.append(_fileName, xrn("## Seasons"))
		seasons.forEach( (season: ISeason) => {
			adapter.append(_fileName, `[[${season.title}]] | `)
		})
		adapter.append(_fileName, xrn(""))
	}
}
let addProductionCompanies = () => {
	if (_settings.showProductionCompanies) {
		adapter.append(_fileName, xrn("## Production Companies"))
		_mediaDetailBase.productionCompanies.forEach( (pc: IProductionCompany) => {
			adapter.append(_fileName, `[[${pc.name}]] | `)
		})
		adapter.append(_fileName, xrn(""))
	}
}
let addFormats = () => {
	if (_settings.showOwnedFormats && _settings.formatList.length > 0 && _settings.formatList[0] != "") {
		adapter.append(_fileName, xrn("## Formats"))
		adapter.append(_fileName, xrn(makeTagString(_settings.formatList)))
	}
}

export async function WriteMovieMediaToFile (media: IMediaSearchResult, settings: MovieManagerSettings) {
	_settings = settings
	new Notice(`Selected ${media.title}`)
	console.log('selected media id: ' + media.id)
	let movieDetailFull = await GetMovieDetails(media.id, settings)
	let mediaBase = movieDetailFull.mediaDetails
	_mediaDetailBase = mediaBase
	_fileName = await handleDuplicateFiles(mediaBase)

	addMeta(MediaType.Movie)
	addGenres()
	addPoster()
	addOverview()
	addCollection(movieDetailFull.collection)
  addCast()
  addProductionCompanies()
  addFormats()
}

export async function WriteTVMediaToFile (media: IMediaSearchResult, settings: MovieManagerSettings) {
	_settings = settings
	new Notice(`Selected ${media.title}`)
	console.log('selected media id: ' + media.id)
	let tvDetailFull = await GetTVDetails(media.id, settings)
	let mediaBase = tvDetailFull.mediaDetails
	_mediaDetailBase = mediaBase
	_fileName = await handleDuplicateFiles(mediaBase)

	addMeta(MediaType.TV)
	addGenres()
	addPoster()
	addOverview()
	addSeasons(tvDetailFull.seasons)
  addCast()
  addProductionCompanies()
  addFormats()
}

