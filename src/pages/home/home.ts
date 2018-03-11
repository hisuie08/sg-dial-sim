import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
	selector: "page-home",
	templateUrl: "home.html"
})
export class HomePage {
	toolTimeline = new TimelineLite();
	glyphs = ["B", "C", "D", "E", "F", "G", "A"];

	constructor(public navCtrl: NavController) {}

	animateChevron(chevron: number) {
		let chevronTimeline = new TimelineLite();
		chevronTimeline.to(`.chevron-${chevron}.sg1-symbol`, 2, { css: { className: "+=engaged" } });
		chevronTimeline.set(`.chevron-${chevron}.sg1-symbol`, { css: { className: "-=starting" } });
		chevronTimeline.to(`.chevron-${chevron}.sg1-symbol`, 2, { css: { className: "-=engaged" } });
		chevronTimeline.add([
			TweenLite.to(`.chevron-${chevron}.chevron-box`, 0.5, { css: { className: "+=locked" } }),
			TweenLite.to(`.chevron-${chevron} > .chevron-tail`, 0.5, { stroke: "red" }),
			TweenLite.to(`.chevron-${chevron} > .chevron-head`, 0.5, { fill: "red" })
		]);
		let lockAnimation = chevron === 7 ? this.animateLocking(true) : this.animateLocking();
		chevronTimeline.add(lockAnimation, 2);
		return chevronTimeline;
	}

	animateLocking(finish?: boolean, fail?: boolean) {
		let chevronTimeline = new TimelineLite();
		chevronTimeline.add([
			TweenLite.to(`.chevron-tail.chevron-7`, 0.5, { y: 20 }),
			TweenLite.to(`.chevron-7.chevron-back`, 0.5, { y: 20 })
		]);
		chevronTimeline.to(`.chevron-head.chevron-7`, 0.5, { y: -10 });
		if (!fail) {
			chevronTimeline.add([
				TweenLite.to(`.chevron-7.chevron-tail-border`, 0.5, { stroke: "red" }),
				TweenLite.to(`.chevron-7.chevron-head`, 0.5, { fill: "red" })
			]);
			chevronTimeline.add(
				[
					TweenLite.to(`.chevron-tail.chevron-7`, 0.5, { y: 0 }),
					TweenLite.to(`.chevron-head.chevron-7`, 0.5, { y: 0 }),
					TweenLite.to(`.chevron-7.chevron-back`, 0.5, { y: 0 })
				],
				"+=0.5"
			);
		}
		if (!finish) {
			chevronTimeline.add(
				[
					TweenLite.to(`.chevron-7.chevron-tail-border`, 0.5, { stroke: "#87cefa" }),
					TweenLite.to(`.chevron-7.chevron-head`, 0.5, { fill: "none" })
				],
				"+=0.5"
			);
		} else {
			chevronTimeline.add(
				[
					TweenMax.to(`.chevron-symbol-box`, 0.15, { backgroundColor: "#add8e6" })
						.repeat(5)
						.yoyo(true)
				],
				"-=0.5"
			);
		}
		return chevronTimeline;
	}

	public beginDialing(address: string[]) {
		address.push("A");
		this.glyphs = address;
		this.runDialingSequence();
	}

	public keyboardStartDialingHandler(event: string[]) {
		this.beginDialing(event);
	}

	ionViewDidLoad() {
		TweenMax.to(`.flasher`, 0.5, { scale: 0, ease: Power4.easeOut })
			.repeat(-1)
			.yoyo(true);
	}

	runDialingSequence() {
		for (let i = 1; i <= 7; i++) {
			this.toolTimeline.add(this.animateChevron(i));
		}
	}
}
