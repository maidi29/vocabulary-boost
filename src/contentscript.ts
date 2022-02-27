document.addEventListener('mouseup', ()=> {
        const selection = window.getSelection()?.toString();
        console.log('selection: ', selection);
    }
);

export {};