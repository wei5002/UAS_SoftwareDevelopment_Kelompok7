// membuat active saat di klik 
document.querySelectorAll('.status_pesanan').forEach(group=>{
    const buttons = group.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', ()=>{
            // hapus yg sebelumnya
            buttons.forEach(btn =>btn.classList.remove('active'));

            // buat active baru 
            button.classList.add('active');
        })
    })
})