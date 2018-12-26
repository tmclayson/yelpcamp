/* eslint-disable func-names */
import './bootstrap-show-password';

// event is triggerred when the initial HTML document has been completely loaded
document.addEventListener('DOMContentLoaded', () => {
    $('#password').tooltip({
        title: 'Caps Lock is on!',
        trigger: 'manual',
    });
    $('#campLocation').tooltip({
        title: 'Please enter the address as accurately as you can. If the campground doesn\'t have an address, please use a google maps plus code.',
    });
});

$(() => {
    $('[data-toggle="tooltip"]').tooltip();
});

$(document).ready(() => {
    // $(document).on('click', '.nav-item a', function (e) {
    //     $(this).parent().addClass('active').siblings()
    //         .removeClass('active');
    // });

    $('.nav-link').removeClass('active');
    $(`a[href="${window.location.pathname}"]`).closest('li').addClass('active');

    $('password').keydown((event) => {
        const caps = event.getModifierState && event.getModifierState('CapsLock');
        if (caps) {
            $('#password').tooltip('show');
        } else {
            $('#password').tooltip('hide');
        }
    });
});
