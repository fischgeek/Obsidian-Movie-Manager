import { MovieManagerSettings } from "interfaces"
import MovieManager from "main"
import { App, PluginSettingTab, sanitizeHTMLToDom, Setting } from "obsidian"

export const DEFAULT_SETTINGS: MovieManagerSettings = {
	apikey: '',
	maxResults: 5,
	useBanner: false,
	addMeta: true,
	addSortTitle: true,
	ignoreThe: true,
	showCollections: true,
	createCollectionFile: false,
	showCast: true,
	castCount: 5,
	showProductionCompanies: true,
	showOwnedFormats: true,
	formats: ["DVD", "Blu-ray", "Plex"],
	defaultFormatsToTrue: true
}

export class SettingsTab extends PluginSettingTab {
	plugin: MovieManager
	settings: MovieManagerSettings

	constructor(app: App, plugin: MovieManager) {
		super(app, plugin)
		this.plugin = plugin
		this.settings = plugin.settings
	}

	display(): void {
		const {containerEl} = this
		containerEl.empty()
		// containerEl.createEl('h1', {text: 'Movie Manager'})

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Your API key. Get one free at https://developer.themoviedb.org!')
			.addText(text => text
				.setPlaceholder('api key')
				.setValue(this.plugin.settings.apikey)
					.onChange(async (value) => {
					console.log('api key: ' + value)
					this.plugin.settings.apikey = value
					await this.plugin.saveSettings()
					this.plugin.registerView
				})
			)

		containerEl.createEl('h2', {text: 'Front matter'})

		const bannersDesc: DocumentFragment = sanitizeHTMLToDom(
			'Adds the banner front matter to be used with the Banners plugin. '
			+ '<p>Currently disabled due to <a href="https://github.com/noatpad/obsidian-banners/issues/105">a bug with the Banners plugin.</a>'
		)

		new Setting(containerEl)
			.setName("User Banner")
			.setDesc(bannersDesc)
			.addToggle(tgl => {
				tgl.setDisabled(true)
				tgl.setValue(this.settings.useBanner)
				tgl.onChange(async (val) => {
					this.settings.useBanner = val
					await this.plugin.saveSettings()
				})
			})

		new Setting(containerEl)
			.setName("Add Meta")
			.setDesc("Adds the id and name to the front matter.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.addMeta)
				tgl.onChange(async (val) => {
					this.settings.addMeta = val
					await this.plugin.saveSettings()
				})
			})

		new Setting(containerEl)
			.setName("Add Sort Title")
			.setDesc(createFragment(desc => {
				desc.appendText("Adds a custom sorting title to the frontmatter to be used with the ")
				desc.createEl("a", { text: "Custom File Explorer sorting plugin", href: "https://obsidian.md/plugins?search=custom%20file%20explorer%20sorting#" })
				desc.appendText(".")
			}))
			.addToggle(tgl => {
				tgl.setValue(this.settings.addSortTitle)
				tgl.onChange(async (val) => {
					this.settings.addSortTitle = val
					await this.plugin.saveSettings()
					this.display()
				})
			})

		const ignoreTheDesc: DocumentFragment = sanitizeHTMLToDom(
				"Ignore the word 'the' at the beginning of titles. Custom File Explorer sorting plugin is required for this to work and a sortspec that targets 'sort-title'. "
				+ '<a href="https://github.com/SebastianMC/obsidian-custom-sort/issues/80#issuecomment-1614750350">See this github issue for reference</a>'
				+ '<br /><br />'
				+ '<p>Example</p>'
				+ '<code>sorting-spec: |<br />'
				+ '&nbsp&nbsptarget-folder: /<br />'
				+ '&nbsp&nbsp< a-z by-metadata: sort-title'
				+ '</code>'
				+ '<br /><br />'
			)
			

		if (this.settings.addSortTitle) {
			new Setting(containerEl)
				.setName("Ignore 'The' in Titles")
				.setDesc(ignoreTheDesc)
				.addToggle(tgl => {
					tgl.setValue(this.settings.ignoreThe)
					tgl.onChange(async val => {
						this.settings.ignoreThe = val
						await this.plugin.saveSettings()
					})
				})
		}

		containerEl.createEl('h2', {text: 'Collections'})

		new Setting(containerEl)
			.setName("Show Collections")
			.setDesc("Adds the Collection section if the movie belongs to a Collection.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showCollections)
				tgl.onChange(async (val) => {
					this.settings.showCollections = val
					await this.plugin.saveSettings()
				})
			})

		containerEl.createEl('h2', {text: 'Cast'})

		new Setting(containerEl)
			.setName("Show Cast")
			.setDesc("Adds the Cast section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showCast)
				tgl.onChange(async (val) => {
					this.settings.showCast = val
					await this.plugin.saveSettings()
				})
			})

		if (this.settings.showCast) {
			new Setting(containerEl)
				.setName("Cast Count")
				.setDesc("The number of cast members to include. Specify -1 for all.")
				.addText(txt => {
					txt.inputEl.type = 'number'
					txt.setValue(this.settings.castCount.toString())
					txt.onChange(async val => {
						this.settings.castCount = parseInt(val)
						await this.plugin.saveSettings()					
					})
				})

		}

		containerEl.createEl('h2', {text: 'Production Companies'})
		
		new Setting(containerEl)
			.setName("Show Production Companies")
			.setDesc("Add the Production Companies section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showProductionCompanies)
				tgl.onChange(async (val) => {
					this.settings.showProductionCompanies = val
					await this.plugin.saveSettings()
				})
			})
	
		containerEl.createEl('h2', {text: 'Formats'})

		new Setting(containerEl)
			.setName("Show Formats")
			.setDesc("Shows your Owned Formats section.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.showOwnedFormats)
				tgl.onChange(async (val) => {
					this.settings.showOwnedFormats = val
					await this.plugin.saveSettings()
					this.display()
				})
			})

		if (this.settings.showOwnedFormats) {
			new Setting(containerEl)
				.setName('Formats')
				.setDesc(createFragment(frag => {
					frag.appendText("A comma separated list of formats (tags) you want to add to the selection when a title is matched. Please keep in mind the allowed list of characters in a tag. Ex: in the tag")
					frag.createEl("code", { text: "#Disney+", attr: { class: "tag-sample" } })
					frag.appendText(", the '+' will be rendered as literal text and not part of the tag.")
				}))
				.addText(text => text
					.setPlaceholder('Blu-ray,DVD,Plex')
					.setValue(this.plugin.settings.formats.toString())
						.onChange(async (value) => {
							this.plugin.settings.formats = value.split(",")
							await this.plugin.saveSettings()
					})
				)
			new Setting(containerEl)
				.setName("Always Owned")
				.setDesc("Set the Formats to always owned (true) in the Formats Modal.")
				.addToggle(tgl => {
					tgl.setValue(this.settings.defaultFormatsToTrue)
					tgl.onChange(async val => {
						this.settings.defaultFormatsToTrue = val
						await this.plugin.saveSettings()
					})
				})

			containerEl.createEl('h2', {text: 'Coming soon!'})

			new Setting(containerEl)
				.setName("Create Collection File")
				.setDesc("Fetch Collection information and create the file when detected in a movie that belongs to a collection.")
				.addToggle(tgl => {
					tgl.setValue(false)
					tgl.setDisabled(true)
				})
		}
	}
}
