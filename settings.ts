import { MovieManagerSettings } from "interfaces";
import MovieManager from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export const DEFAULT_SETTINGS: MovieManagerSettings = {
	apikey: '',
	maxResults: 5,
	useBanner: false,
	showCast: true,
	castCount: 5,
	showProductionCompanies: true,
	showOwnedFormats: true,
	formats: ["DVD", "Blu-ray", "Plex"],
	defaultFormatsToTrue: true
}

export class SettingsTab extends PluginSettingTab {
	plugin: MovieManager;
	settings: MovieManagerSettings

	constructor(app: App, plugin: MovieManager) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings
	}

	display(): void {
		const {containerEl} = this;
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

		containerEl.createEl('h2', {text: 'Front matter'});

		new Setting(containerEl)
			.setName("User Banner")
			.setDesc("Adds the banner front matter to be used with the Banners plugin.")
			.addToggle(tgl => {
				tgl.setValue(this.settings.useBanner)
				tgl.onChange(async (val) => {
					this.settings.useBanner = val
					await this.plugin.saveSettings()
				})
			})

		containerEl.createEl('h2', {text: 'Cast'});

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

		containerEl.createEl('h2', {text: 'Production Companies'});
		
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
	
		containerEl.createEl('h2', {text: 'Formats'});

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
		}
	}
}
