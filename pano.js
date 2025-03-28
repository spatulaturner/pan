function clickOpenTooltip() {
    let div = this.div;
    let span = $(div).find('span');
    let pano = $(div).closest('.panorama')
    let currentIndex = $(div).attr('index');
    let totalHotSpots = $(pano).find('.custom-hotspot').length

    if ($(div).hasClass('active') && !$(div).hasClass('isCurrentHotspot')) {
        $(div).closest('.panorama').find('.custom-hotspot').each(function () {
            $(this).removeClass('active')
            $(this).find('span').removeClass('active')
            $(div).closest('.panorama').find('.vo-content').text('')
        })
    } else {
        $(div).closest('.panorama').find('.custom-hotspot').each(function () {
            $(this).removeClass('active')
            $(this).find('span').removeClass('active')
            $(div).closest('.panorama').find('.vo-content').text('')
        })
        $(div).addClass('active')
        $(span).addClass('active')
        $(div).closest('.panorama').find('.vo-content').text($(div).attr('aria-label'))
        $(div).closest('.panorama').find('.vo-content').attr('tabindex', 0)
        console.log($(div).closest('.panorama'))
        $(div).closest('.panorama').find('.vo-content').focus();
        $(div).removeClass('isCurrentHotspot')
    }

    $(div).addClass('visited')

    let totalViewed = $(pano).find('.visited').length;

    checkPrevButton(currentIndex, totalHotSpots, pano);
    updateCount(totalViewed, totalHotSpots, pano);

    // scroll position - chrome
    let windowOffset = window.pageYOffset;

    // get then set scroll position so there is no jumping
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop
    if(scrollPos == 0){
        document.documentElement.scrollTop = document.body.scrollTop = windowOffset
    } else {        
        document.documentElement.scrollTop = document.body.scrollTop = scrollPos
    }

}

let panoCount = 1;

// Hot spot creation function
function hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    var span = document.createElement('span');
    span.innerHTML = args[0];
    hotSpotDiv.appendChild(span);
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';
    $(hotSpotDiv).attr({
        'role': 'button',
        'aria-label': args[2] + args[0] + args[1],
        'index': args[4]
    })
    $(hotSpotDiv).addClass(args[3])
}

function updateCount(totalViewed, totalIndex, pano){
    $(pano).find('.hotspot-count').text(totalViewed);
    $(pano).find('.total-hotspot').text(totalIndex);
}

function checkPrevButton(currentIndex, totalIndex, pano){

    let prevButton = $(pano).find('.previoushotspot');

    if(currentIndex > 1) {
        $(prevButton).attr('disabled', false)
        $(prevButton).find('.back-disabled').addClass('hidden')
        $(prevButton).find('.back-enabled').removeClass('hidden')
    } else {
        $(prevButton).attr('disabled', true)
        $(prevButton).find('.back-disabled').removeClass('hidden')
        $(prevButton).find('.back-enabled').addClass('hidden')
    }

    let totalViewed = $(pano).find('.visited').length;

    if(totalViewed == totalIndex){
        $(prevButton).attr('disabled', false)
        $(prevButton).find('.back-disabled').addClass('hidden')
        $(prevButton).find('.back-enabled').removeClass('hidden')
        $(pano).find('.green-check').removeClass('hidden')
    }
    updateCount(totalViewed, totalIndex, pano)
}

$(document).ready(function () {
    let currentPano;

    let viewers = [];

    $('.panorama').each(function () {
        currentPano = 'panorama' + panoCount;
        let hotspots = $(this).find('.pano-hotspots span');
        let hotspotsObj = [];

        let totalHotspots = hotspots.length;
        let of = $(this).find('.of-text').text();
        let item = $(this).find('.item-text').text();

        let image = $(this).find('.pano-image img').attr('src');

        for (var i = 0; i < hotspots.length; i++) {
            let pitch = $(hotspots[i]).attr('data-pitch')
            let yaw = $(hotspots[i]).attr('data-yaw')
            let createTooltipArgs = $(hotspots[i]).text();
            let hotspotLabel = $(hotspots[i]).attr('aria-label') + ', ';
            let hotspotStyle = $(hotspots[i]).attr('data-style')
            let voCount = ', ' + item + ' ' + (i + 1) + ' ' + of + ' ' + totalHotspots;
            var newData = {
                "pitch": pitch,
                "yaw": yaw,
                "cssClass": "custom-hotspot",
                "createTooltipFunc": hotspot,
                "createTooltipArgs": [createTooltipArgs, voCount, hotspotLabel, hotspotStyle, (i+1)],
                "clickHandlerFunc": clickOpenTooltip
            };
            hotspotsObj.push(newData);
        }

        let newViewer = pannellum.viewer(currentPano, {
            "type": "equirectangular",
            "panorama": image,
            "autoLoad": true,
            "showControls": false,
            // "hotSpotDebug": true,
            "keyboardZoom": false,
            "hotSpots": hotspotsObj
        })

        viewers.push(newViewer);

        panoCount++;

    })

    $('.panorama').each(function () {
        $(this).attr('tabindex', 0)

        let pano = this;
        setTimeout(function () {

            let totalHotSpots = $(pano).find('.pnlm-render-container .custom-hotspot').length;
            
            $(pano).find('.pnlm-render-container .custom-hotspot').each(function () {
                if($(this).attr('index') == 1) {
                    $(this).addClass('isNextHotspot')
                }

                if($(this).attr('index') == totalHotSpots) {
                    $(this).addClass('isPrevHotspot')
                }
                
            })

            updateCount(0, totalHotSpots, pano);

        }, 500) 
    })

    $('.zoom-in').on('click', function (e) {
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;
        viewers[panoIndex].setHfov(viewers[panoIndex].getHfov() - 10);
    });
    $('.zoom-out').on('click', function (e) {
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;
        viewers[panoIndex].setHfov(viewers[panoIndex].getHfov() + 10);
    });
    $('.fullscreen').on('click', function (e) {
        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;
        $(this).toggleClass('open')
        viewers[panoIndex].toggleFullscreen();
    });

    let currentHotspotInView;



    $('.nexthotspot').on('click', function (e) {

        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;

        let pano = $(this).closest('.panorama');

        currentHotspotInView = $(pano).find('.isNextHotspot');
        let currentHotspotContent = currentHotspotInView.text();

        let currentIndex = parseInt(currentHotspotInView.attr('index'));
        let totalHotspots = $(pano).find('.custom-hotspot').length;

        let previousHotspot;
        let nextHotspot;

        let nextIndex = currentIndex + 1;
        let prevIndex = currentIndex - 1;

        if(nextIndex > totalHotspots){
            nextIndex = 1;
        }

        if(prevIndex < 1){
            prevIndex = totalHotspots;
        }

        // if currentindex = max >> next goes to first; if current index = 1 >> prev goes to last
        $(pano).find('.custom-hotspot').each(function(){
            $(this).removeClass('isNextHotspot')
            $(this).removeClass('isPrevHotspot')
            if($(this).attr('index') == nextIndex) {
                nextHotspot = $(this);
            }

            if($(this).attr('index') == prevIndex) {
                previousHotspot = $(this);
            }
        })

        let nextYaw;
        let nextPitch;

        $('.pano-hotspots span').each(function () {
            let htmlHotspot = $(this)
            let hotspotSpanText = $(htmlHotspot).text();

            $(htmlHotspot).removeClass('isCurrentHotspot')

            if (hotspotSpanText == currentHotspotContent) {
                nextYaw = $(htmlHotspot).attr('data-yaw');
                nextPitch = $(htmlHotspot).attr('data-pitch');
            }
        })

        viewers[panoIndex].setYaw(nextYaw);
        viewers[panoIndex].setPitch(nextPitch);

        // move class to NEXT + PREVIOUS hotspots
        $(currentHotspotInView).removeClass('isNextHotspot')
        $(currentHotspotInView).addClass('isCurrentHotspot')
        $(nextHotspot).addClass('isNextHotspot')
        $(previousHotspot).addClass('isPrevHotspot')

        $(currentHotspotInView).click();

        
    })
    
    $('.previoushotspot').on('click', function (e) {

        let panoIndex = $(this).closest('.panorama').attr('index');
        panoIndex = parseInt(panoIndex) - 1;

        let pano = $(this).closest('.panorama');

        currentHotspotInView = $(pano).find('.isPrevHotspot');

        let currentHotspotContent = currentHotspotInView.text();


        let currentIndex = parseInt(currentHotspotInView.attr('index'));
        let totalHotspots = $(pano).find('.custom-hotspot').length;

        let previousHotspot;
        let nextHotspot;

        let nextIndex = currentIndex + 1;
        let prevIndex = currentIndex - 1;

        if(nextIndex > totalHotspots){
            nextIndex = 1;
        }

        if(prevIndex < 1){
            prevIndex = totalHotspots;
        }

        // if currentindex = max >> next goes to first; if current index = 1 >> prev goes to last
        $(pano).find('.custom-hotspot').each(function(){
            $(this).removeClass('isNextHotspot')
            $(this).removeClass('isPrevHotspot')
            if($(this).attr('index') == nextIndex) {
                nextHotspot = $(this);
            }

            if($(this).attr('index') == prevIndex) {
                previousHotspot = $(this);
            }
        })

        let nextYaw;
        let nextPitch;

        $('.pano-hotspots span').each(function () {
            let htmlHotspot = $(this)
            let hotspotSpanText = $(htmlHotspot).text();

            $(htmlHotspot).removeClass('isCurrentHotspot')

            if (hotspotSpanText == currentHotspotContent) {
                nextYaw = $(htmlHotspot).attr('data-yaw');
                nextPitch = $(htmlHotspot).attr('data-pitch');
            }
        })

        viewers[panoIndex].setYaw(nextYaw);
        viewers[panoIndex].setPitch(nextPitch);

        // move class to NEXT + PREVIOUS hotspots
        $(currentHotspotInView).removeClass('isPrevHotspot')
        $(currentHotspotInView).addClass('isCurrentHotspot')
        $(nextHotspot).addClass('isNextHotspot')
        $(previousHotspot).addClass('isPrevHotspot')

        $(currentHotspotInView).click();

    })

    $('.custom-hotspot').on('click touch', function () {
        $(this).clickOpenTooltip()
    })
})