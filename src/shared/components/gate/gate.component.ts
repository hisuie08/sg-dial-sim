import { Component, ElementRef, Input, ViewChild, SimpleChanges } from "@angular/core";

import { Power1, Power4, TimelineLite, TweenMax } from "gsap";

@Component({
	selector: "gate",
	templateUrl: "./gate.component.html",
	styleUrls: ["./gate.component.scss"]
})
export class GateComponent {
	@Input()
	public status: string;

	@ViewChild("eventHorizon", { read: ElementRef })
	private eventHorizon: ElementRef;

	private flasher: TweenMax;

	private ngAfterViewInit() {
		this.updateFlasher();
	}

	private ngOnChanges(changes: SimpleChanges) {
		if (changes.status) {
			this.updateFlasher();
		}
	}

	private updateFlasher() {
		if (this.flasher) {
			this.flasher.repeat(0);
		}
		let timeline = new TimelineLite();
		switch (this.status) {
			case "IDLE":
				this.flasher = TweenMax.to(this.eventHorizon.nativeElement, 0.5, { scale: 1, ease: Power4.easeIn })
					.repeat(-1)
					.yoyo(true);
				break;
			case "ACTIVE":
				timeline.to(this.eventHorizon.nativeElement, 0.5, { scale: 0, ease: Power4.easeOut });
				timeline.set(this.eventHorizon.nativeElement, { css: { className: "+=active" } });
				timeline.to(this.eventHorizon.nativeElement, 1, { scale: 4, ease: Power1.easeIn });
				timeline.to(this.eventHorizon.nativeElement, 1, { scale: 3, ease: Power1.easeInOut });
				timeline.add(this.flasher = TweenMax.to(this.eventHorizon.nativeElement, 1, { scale: 2.75, ease: Power1.easeInOut })
					.repeat(-1)
					.yoyo(true)
				);
				break;
			case "SHUTDOWN":
				timeline.to(this.eventHorizon.nativeElement, 1, { scale: 4, opacity: 0, ease: Power4.easeIn });
				break;
		}
	}
}