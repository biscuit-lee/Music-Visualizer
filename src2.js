const audioContext = new AudioContext();
const playButton = document.getElementById('play-button');


playButton.addEventListener('click', () => {
    fetch('./audio3.mp3')
    .then(response => response.arrayBuffer())
    .then(audioData => {
        audioContext.decodeAudioData(audioData, buffer => {
            const bufferSource = audioContext.createBufferSource();
            const analyser = audioContext.createAnalyser();

            
            // this
            bufferSource.connect(analyser);
            analyser.connect(audioContext.destination);
            
            bufferSource.buffer = buffer; // assigns what sound to play
            bufferSource.start();

            
            function draw(){
                // configuration for our canvas
                const canvas = document.getElementById('myCanvas')
                const context = canvas.getContext('2d');

                canvas.width = window.innerWidth;
                canvas.height =  window.innerHeight / 2;
                canvas.style.background = 'white';

                
                
                
                const frequencyData = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(frequencyData);
                const bufferLength = analyser.frequencyBinCount;
                

                
                context.beginPath();

                const margin = window.innerWidth / bufferLength;
                let x = 100;
                for (let i = 0; i < bufferLength;++i){
                    let y = canvas.height - (frequencyData[i] / 255 * (canvas.height / 2));
                    
                    if (i == 0){
                        context.moveTo(x,window.innerHeight/4)

                    }else{
                        context.lineTo(x,y);
                    }
                    x+=margin;
                }

                context.stroke()
                requestAnimationFrame(draw);
            }

            draw();
        });
        
    });
})