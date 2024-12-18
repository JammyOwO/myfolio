/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

// Gallery.
$('.gallery')
.on('click', 'a', function(event) {

	var $a = $(this),
		$gallery = $a.parents('.gallery'),
		$modal = $gallery.children('.modal'),
		$modalImg = $modal.find('img'),
		href = $a.attr('href');

	// Not an image? Bail.
		if (!href.match(/\.(jpg|gif|png|mp4)$/))
			return;

	// Prevent default.
		event.preventDefault();
		event.stopPropagation();

	// Locked? Bail.
		if ($modal[0]._locked)
			return;

	// Lock.
		$modal[0]._locked = true;

	// Set src.
		$modalImg.attr('src', href);

	// Set visible.
		$modal.addClass('visible');

	// Focus.
		$modal.focus();

	// Delay.
		setTimeout(function() {

			// Unlock.
				$modal[0]._locked = false;

		}, 600);

})
.on('click', '.modal', function(event) {

	var $modal = $(this),
		$modalImg = $modal.find('img');

	// Locked? Bail.
		if ($modal[0]._locked)
			return;

	// Already hidden? Bail.
		if (!$modal.hasClass('visible'))
			return;

	// Stop propagation.
		event.stopPropagation();

	// Lock.
		$modal[0]._locked = true;

	// Clear visible, loaded.
		$modal
			.removeClass('loaded')

	// Delay.
		setTimeout(function() {

			$modal
				.removeClass('visible')

			setTimeout(function() {

				// Clear src.
					$modalImg.attr('src', '');

				// Unlock.
					$modal[0]._locked = false;

				// Focus.
					$body.focus();

			}, 475);

		}, 125);

})
.on('keypress', '.modal', function(event) {

	var $modal = $(this);

	// Escape? Hide modal.
		if (event.keyCode == 27)
			$modal.trigger('click');

})
.on('mouseup mousedown mousemove', '.modal', function(event) {

	// Stop propagation.
		event.stopPropagation();

})
.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
	.find('img')
		.on('load', function(event) {

			var $modalImg = $(this),
				$modal = $modalImg.parents('.modal');

			setTimeout(function() {

				// No longer visible? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Set loaded.
					$modal.addClass('loaded');

			}, 275);

		});


})(jQuery);

document.querySelectorAll('.menu-item').forEach(item => {
    let hideTimeout; // Store timeout ID for delay

    item.addEventListener('mouseenter', function () {
        const dropdownId = item.getAttribute('data-dropdown-target');
        const dropdown = document.getElementById(dropdownId);

        // Clear any existing timeout to prevent hiding
        clearTimeout(hideTimeout);

        // Position the dropdown next to the menu item
        const rect = item.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;

        // Show the dropdown by adding the active class
        dropdown.classList.add('active');
    });

    item.addEventListener('mouseleave', function () {
        const dropdownId = item.getAttribute('data-dropdown-target');
        const dropdown = document.getElementById(dropdownId);

        // Set a timeout to remove the active class after a delay
        hideTimeout = setTimeout(() => {
            dropdown.classList.remove('active');
        }, 300); // Adjust the delay as needed (in milliseconds)
    });

    // Keep the dropdown visible while hovering over it
    const dropdown = document.getElementById(item.getAttribute('data-dropdown-target'));
    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout); // Prevent hiding if mouse enters dropdown
        dropdown.classList.add('active');
    });

    dropdown.addEventListener('mouseleave', () => {
        // Set a timeout to hide the dropdown after a delay
        hideTimeout = setTimeout(() => {
            dropdown.classList.remove('active');
        }, 300); // Adjust delay duration as needed
    });
});


// Image Modal.
$('.image-modal')
.on('click', 'a', function(event) {

	var $a = $(this),
		$modal = $a.siblings('.modal'),
		$modalImg = $modal.find('img'),
		href = $a.attr('href');

	// Not an image? Bail.
	if (!href.match(/\.(jpg|gif|png|mp4)$/)) return;

	// Prevent default.
	event.preventDefault();
	event.stopPropagation();

	// Locked? Bail.
	if ($modal[0]._locked) return;

	// Lock.
	$modal[0]._locked = true;

	// Set src.
	$modalImg.attr('src', href);

	// Set visible.
	$modal.addClass('visible');

	// Focus.
	$modal.focus();

	// Delay.
	setTimeout(function() {
		$modal[0]._locked = false;
	}, 600);
})
.on('click', '.modal', function(event) {

	var $modal = $(this),
		$modalImg = $modal.find('img');

	// Locked? Bail.
	if ($modal[0]._locked) return;

	// Already hidden? Bail.
	if (!$modal.hasClass('visible')) return;

	// Stop propagation.
	event.stopPropagation();

	// Lock.
	$modal[0]._locked = true;

	// Clear visible, loaded.
	$modal.removeClass('loaded');

	// Delay.
	setTimeout(function() {
		$modal.removeClass('visible');
		setTimeout(function() {

			// Clear src.
			$modalImg.attr('src', '');

			// Unlock.
			$modal[0]._locked = false;

		}, 475);
	}, 125);
})
.on('keypress', '.modal', function(event) {
	var $modal = $(this);

	// Escape? Hide modal.
	if (event.keyCode == 27) $modal.trigger('click');
})
.on('mouseup mousedown mousemove', '.modal', function(event) {
	// Stop propagation.
	event.stopPropagation();
})
.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
.find('img')
.on('load', function(event) {
	var $modalImg = $(this),
		$modal = $modalImg.parents('.modal');

	setTimeout(function() {
		if (!$modal.hasClass('visible')) return;
		$modal.addClass('loaded');
	}, 275);
});