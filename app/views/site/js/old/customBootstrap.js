define(['jquery','bootstrap'], function($) {
	/**
	 * Adds fullscreen functionality to Modals. To activate, add data-backdrop="fullscreen" to the modal container
	 */
	$(document).on({
		'show.bs.modal': function () {
			$(this).addClass('modal-fullscreen');
			setTimeout( function() {
				$(".modal-backdrop").addClass('modal-backdrop-fullscreen');
			}, 0);
		},
		'hidden.bs.modal': function () {
			$('.modal-backdrop').addClass('modal-backdrop-fullscreen');
		}
	}, '[data-backdrop="fullscreen"]');

	/**
	 * Adds transparent functionality to Modals. To activate, add data-backdrop="transparent" to the modal container
	 */
	$(document).on({
		'show.bs.modal': function () {
			$(this).addClass('modal-transparent');
			setTimeout( function() {
				$(".modal-backdrop").addClass('modal-backdrop-transparent');
			}, 0);
		},
		'hidden.bs.modal': function () {
			$('.modal-backdrop').addClass('modal-backdrop-transparent');
		}
	}, '[data-backdrop="transparent"]');

	/**
	 * Allow Modals to load on top of Modals and prevent the scroll from breaking
	 */
	$(document).on({
		'show.bs.modal': function () {
			var zIndex = 1040 + (10 * $('.modal:visible').length);
			$(this).css('z-index', zIndex);
			setTimeout(function() {
				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
			}, 0);
		},
		'hidden.bs.modal': function() {
			if ($('.modal:visible').length > 0) {
				// restore the modal-open class to the body element, so that scrolling works
				// properly after de-stacking a modal.
				setTimeout(function() {
					$(document.body).addClass('modal-open');
				}, 0);
			}
		}
	}, '.modal');
});