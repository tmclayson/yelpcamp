document.addEventListener('keydown', (event) => {
    const caps = event.getModifierState && event.getModifierState('CapsLock');
    console.log(caps); // true when you press the keyboard CapsLock key
});
