class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.player=null;
        this.cursors=null;
        this.pistola=null; //per guardar estadistiques
        this.ganivet=null; //per guardar estadístiques
    }

    preload (){	
        this.load.spritesheet('ma_caminar','../../resources/sense_arma/caminar_ma.png',{frameWidth: 279, frameHeight: 219});
        this.load.spritesheet('ma_quiet','../../resources/sense_arma/quiet_ma.png',{frameWidth: 289, frameHeight: 224});
        this.load.spritesheet('ma_atac','../../resources/sense_arma/atacar_ma.png',{frameWidth: 329, frameHeight: 300});
        this.load.spritesheet('pistola_caminar','../../resources/pistola/caminar_pistola.png',{frameWidth: 258, frameHeight: 220});
        this.load.spritesheet('pistola_quiet','../../resources/pistola/quiet_pistola.png',{frameWidth: 253, frameHeight: 216});
        this.load.spritesheet('pistola_atac','../../resources/pistola/atacar_pistola.png',{frameWidth: 255, frameHeight: 215});
        this.load.spritesheet('pistola_cop','../../resources/pistola/golpejar_pistola.png',{frameWidth: 291, frameHeight: 256});
        this.load.spritesheet('pistola_recarregar','../../resources/pistola/recarregar_pistola.png',{frameWidth: 260, frameHeight: 230});

	}
    create (){	
        this.player = this.physics.add.sprite(400,300,'ma_caminar').setScale(0.5).refreshBody();
        this.player.setBounce(0.2);
        this.player.accio="quiet";
        this.player.velocitat=120;
        this.player.cooldown_disparar=false;
        this.player.cooldown_animacio=false;
        var ganivet = {
            nom: "ganivet",
            cadencia: 800,
            min_cadencia:400
        };
        this.ganivet=ganivet;
        var pistola = {
            nom: "pistola",
            bales: 1,
            municio: 0,
            cadencia: 400,
            min_cadencia:150,
            velocitat_recarrega: 2500,
            velocitat_recarrega_min: 800
        };
        this.pistola=pistola;
        this.player.arma=this.pistola;

        


        this.anims.create ({
            key: 'caminar_ma',
            frames: this.anims.generateFrameNumbers('ma_caminar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create ({
            key: 'quiet_ma',
            frames: this.anims.generateFrameNumbers('ma_quiet', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create ({
            key: 'atac_ma',
            frames: this.anims.generateFrameNumbers('ma_atac', { start: 0, end: 14 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create ({
            key: 'caminar_pistola',
            frames: this.anims.generateFrameNumbers('pistola_caminar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create ({
            key: 'quiet_pistola',
            frames: this.anims.generateFrameNumbers('pistola_quiet', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create ({
            key: 'atac_pistola',
            frames: this.anims.generateFrameNumbers('pistola_atac', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create ({
            key: 'cop_pistola',
            frames: this.anims.generateFrameNumbers('pistola_cop', { start: 0, end: 13 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create ({
            key: 'recarregar_pistola',
            frames: this.anims.generateFrameNumbers('pistola_recarregar', { start: 0, end: 13 }),
            frameRate: 30,
            repeat: 0
        });
        this.player.anims.play('quiet_ma');



        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.D=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D,true,true);
        this.cursors.A=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A,true,true);
        this.cursors.S=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S,true,true);
        this.cursors.W=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W,true,true);

        this.input.on('pointerdown', (pointer) => {

            this.disparar(pointer.x,pointer.y);
    
    
        }, this);
	}
    
    disparar(posx,posy){
        if(!this.player.cooldown_disparar){
            this.player.cooldown_disparar=true;
            this.player.cooldown_animacio=true;
            this.player.accio="atacar";
            var posicio= new Phaser.Math.Vector2(posx,posy);
            var direccio=new Phaser.Math.Vector2();
            direccio=posicio.subtract(this.player.body.position);
            direccio.normalize();
            var angle=direccio.angle();
            angle=angle/Math.PI*180;
            if(this.player.arma.nom=="ganivet" || (this.player.arma.bales == 0 && this.player.arma.municio == 0)){//si s'ha de fer atac cos
                this.player.angle=angle;
                this.atac_cos(direccio);
            } 
            else{
                if (this.player.arma.bales==0){
                    this.player.accio="recarregar";
                    this.recarregar();
                } 
                else{
                    this.player.angle=angle;
                    this.atac_distancia(direccio);
                }
            }
        }
    }

    recarregar(){
        if(this.player.arma.nom=="pistola"){
            this.player.anims.play('recarregar_pistola');
            this.player.anims.msPerFrame  = this.player.arma.velocitat_recarrega/15;//canvio la velocitat de l'animacio segons la velocitat de recarrega
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.velocitat_recarrega, callback: this.cooldown_animacio_reset, callbackScope: this});
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.velocitat_recarrega, callback: this.cooldown_disparar_reset, callbackScope: this});
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }

    }

    cooldown_animacio_reset(){
        this.player.cooldown_animacio=false;
    }
    cooldown_disparar_reset(){
        this.player.cooldown_disparar=false;
    }

    atac_cos(dir){
        if (this.player.arma.nom=="ganivet"){
            this.player.anims.play('atac_ma');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this});
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this});
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }
        if(this.player.arma.nom=="pistola"){
            this.player.anims.play('cop_pistola');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.ganivet.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this});
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.ganivet.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this});
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }
        
    }

    atac_distancia(dir){
        if (this.player.arma.nom=="pistola"){
            this.player.anims.play('atac_pistola');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this});
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this});
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }
    }
    
	
	update (){	
        if(this.cursors.D.isDown){
            if(this.player.accio=="quiet" || (this.player.accio=="atacar" && this.player.cooldown_animacio==false)){
                if(this.player.arma.nom=="ganivet") this.player.anims.play('caminar_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('caminar_pistola');
                this.player.accio="dreta";
            }
            if(this.cursors.S.isDown){
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=45;
                this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat,2)/2)); //perque el modul de la velocitat sigui el que ha de ser ja que sino aniria mes ràpid en diagonal
                this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else if(this.cursors.W.isDown){
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=-45;
                this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else{
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=0;
                this.player.setVelocityX(this.player.velocitat);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.A.isDown){
            if(this.player.accio=="quiet" || (this.player.accio=="atacar" && this.player.cooldown_animacio==false)){
                if(this.player.arma.nom=="ganivet") this.player.anims.play('caminar_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('caminar_pistola');
                this.player.accio="esquerra";
            }
            if(this.cursors.S.isDown){
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=135;
                this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else if(this.cursors.W.isDown){
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=225;
                this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else{
                if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=180;
                this.player.setVelocityX(-this.player.velocitat);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.S.isDown){
            if(this.player.accio=="quiet" || (this.player.accio=="atacar" && this.player.cooldown_animacio==false)){
                if(this.player.arma.nom=="ganivet") this.player.anims.play('caminar_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('caminar_pistola');
                this.player.accio="avall";
            }
            if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=90;
            this.player.setVelocityY(this.player.velocitat);
            this.player.setVelocityX(0);
        } 
        else if(this.cursors.W.isDown){
            if(this.player.accio=="quiet" || (this.player.accio=="atacar" && this.player.cooldown_animacio==false)){
                if(this.player.arma.nom=="ganivet") this.player.anims.play('caminar_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('caminar_pistola');
                this.player.accio="amunt";
            }
            if(!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio=="recarregar")) this.player.angle=-90;
            this.player.setVelocityY(-this.player.velocitat);
            this.player.setVelocityX(0);
        } 
        else{//no es presiona cap tecla de moviment
            if (this.player.accio!="quiet"){
                if(this.player.accio!="atacar" || this.player.cooldown_animacio==false){
                    if(this.player.arma.nom=="ganivet") this.player.anims.play('quiet_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('quiet_pistola');
                    this.player.accio="quiet";
                }  
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
            }
        }
    }
}

