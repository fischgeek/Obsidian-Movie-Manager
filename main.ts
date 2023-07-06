import { Notice, Plugin } from 'obsidian'
import { SearchMovie, SearchTV } from 'tmdb'
import { MediaType, MovieManagerSettings } from 'interfaces'
import { DEFAULT_SETTINGS, SettingsTab } from 'settings'
import { SearchModal } from 'modal-search'
import { SearchResultModal } from 'modal-search-results'

/*
SUBMISSION READY
[/] handle movies with same names // need better logic to compare id's and only do if different
[ ] genres as tags option
[ ] cast as links option
[ ] seasons as links option
[ ] prodcution companies as links option
[ ] formats as tags option
[ ] production company delimiter / display option [flat,bullet]
[ ] seasons delimiter / display option [flat,bullet]
WOULD LIKE TO
[ ] show movie count in status bar
[/] defaults for formats // half done. would like to do this per format (dynamically)
DONE
[x] refresh the focused movie (tab)
[x] handle collections
[x] handle tv series
*/

export default class MovieManager extends Plugin {
	settings: MovieManagerSettings

	async onload() {
		await this.loadSettings()

		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!')
		// })
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class')

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem()
		// statusBarItemEl.setText('Status Bar Text')

		this.addCommand({
			id: 'add-movie',
			name: 'Add a Movie',
			callback: () => {
				new SearchModal(this.app, async (result) => {
					console.log('apikey: ' + this.settings.apikey)
					if (!this.settings.apikey) {
						new Notice('Missing API Key')
					} else {
						let movieSearchResults = await SearchMovie(result, this.settings)
						new SearchResultModal(this.app, movieSearchResults, this.settings, MediaType.Movie).open()
					}
					}).open()
			}
		})

		this.addCommand({
			id: 'add-tv',
			name: 'Add a TV Series',
			callback: () => {
				new SearchModal(this.app, async (result) => {
					console.log('apikey: ' + this.settings.apikey)
					if (!this.settings.apikey) {
						new Notice('Missing API Key')
					} else {
						let tvSearchResults = await SearchTV(result, this.settings)
						new SearchResultModal(this.app, tvSearchResults, this.settings, MediaType.TV).open()
					}
					}).open()
			}
		})

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'rescan-active-title',
			name: 'Rescan Active Title',
			callback: async () => {
				let activeTitle = this.app.workspace.getActiveFile()
				if (activeTitle) {
					let metadata = this.app.metadataCache.getFileCache(activeTitle)?.frontmatter
					let mediaType = MediaType.Movie
					if (metadata?.media_type) {
						mediaType = metadata?.media_type
					}
					if (mediaType == MediaType.Movie) {
						let movieSearchResults = await SearchMovie(activeTitle.basename, this.settings)
						new SearchResultModal(this.app, movieSearchResults, this.settings, MediaType.Movie).open()
					} else {
						let tvSearchResults = await SearchTV(activeTitle.basename, this.settings)
						new SearchResultModal(this.app, tvSearchResults, this.settings, MediaType.TV).open()
					}
				}
			}
		})

		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: async (editor: Editor, view: MarkdownView) => {
		// 		// console.log(editor.getSelection())
		// 		// console.log('current file: ' + view.file.basename)
		// 		// let metadata = this.app.metadataCache.getFileCache(view.file)?.frontmatter
		// 		// console.log(metadata)
		// 		// let title = metadata?.sort_titles
		// 		// console.log(title)
		// 		// editor.replaceSelection('Sample Editor Command')
		// 		let movieSearchResults = await SearchMovie(view.file.basename, this.settings)
		// 		new SearchResultModal(this.app, movieSearchResults, this.settings).open()
		// 	}
		// })
		
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				// new SampleModal(this.app).open()
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true
		// 		}
		// 	}
		// })

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this))

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			// console.log('click', evt)
		// })

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000))

		// this.addRibbonIcon('dice', 'Hello World', () => {
		// 	new Notice('Hello, world!')
		// })
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
