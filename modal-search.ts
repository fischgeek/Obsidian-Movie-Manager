import { Modal, App, Setting, TextComponent } from "obsidian"
import { text } from "stream/consumers"

export class SearchModal extends Modal {
	result: string
	onSubmit: (result: string) => void
	
	constructor(app: App, onSubmit: (result: string) => void) {
		super(app)
		this.onSubmit = onSubmit
	}
	
	onOpen() {
		const { contentEl } = this

		contentEl.createEl("h1", { text: "Movie title" })

		new Setting(contentEl)
			.setName("Title")
			.addText((text) =>
				text.onChange((value) => {
					this.result = value
				})
		)
	
		new Setting(contentEl)
			.addButton((btn) =>
					btn
					.setButtonText("Search")
					.setCta()
					.onClick(() => {
						this.close()
						this.onSubmit(this.result)
					})
				)
	}
	
	onClose() {
		let { contentEl } = this
		contentEl.empty()
	}
}
