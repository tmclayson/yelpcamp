import './bootstrap-show-password';
import './checkCapsLock';

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

document.getElementById('password').addEventListener('keydown', (event) => {
    const caps = event.getModifierState && event.getModifierState('CapsLock');
    if (caps) {
        $('#password').tooltip('show');
    } else {
        $('#password').tooltip('hide');
    }
});

$(() => {
    $('[data-toggle="tooltip"]').tooltip();
});
