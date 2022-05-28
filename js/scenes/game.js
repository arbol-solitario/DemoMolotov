class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.player=null;
        this.cursors=null;
    }

    preload (){	
        this.load.spritesheet('ma_caminar','../../resources/sense_arma/caminar_ma.png',{frameWidth: 279, frameHeight: 219});
        this.load.spritesheet('ma_quiet','../../resources/sense_arma/quiet_ma.png',{frameWidth: 289, frameHeight: 224});
        this.load.spritesheet('pistola_caminar','../../resources/pistola/caminar_pistola.png',{frameWidth: 258, frameHeight: 220});
        this.load.spritesheet('pistola_quiet','../../resources/pistola/quiet_pistola.png',{frameWidth: 253, frameHeight: 216});

	}
    create (){	
        this.player = this.physics.add.sprite(400,300,'ma_caminar').setScale(0.25).refreshBody();
        this.player.setBounce(0.2);
        this.player.accio="quiet";
        this.player.velocitat=120;
        this.player.cooldown=false;
        var ganivet = {
            nom: "ganivet"
        };
        var pistola = {
            nom: "pistola"
        };
        this.player.arma=ganivet;

        


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
        this.player.anims.play('quiet_ma');



        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.D=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D,true,true);
        this.cursors.A=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A,true,true);
        this.cursors.S=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S,true,true);
        this.cursors.W=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W,true,true);

        this.input.on('pointerdown', function (pointer) {

            this.disparar(pointer.x,pointer.y);
    
    
        }, this);
	}
    
    disparar(posx,posy){
        if(this.player.cooldown==false){
            this.player.cooldown=true;
            this.player.accio="atacar";
            var posratoli= new Phaser.Math.Vector2(posx,posy);
            var direccio=new Phaser.Math.Vector2();
            direccio=posratoli.substract(this.player.position);
            //direccio.normalize();
            console.log(direccio.x);
        }
    }
	
	update (){	
        if(this.cursors.D.isDown){
            if(this.player.accio=="quiet" || (this.player.accio=="atacar" && this.player.cooldown==false)){
                if(this.player.arma.nom=="ganivet") this.player.anims.play('caminar_ma');
                else if (this.player.arma.nom=="pistola") this.player.anims.play('caminar_pistola');
            }
            this.player.accio="dreta";
            if(this.cursors.S.isDown){
                this.player.rotation=0.785;
                this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat,2)/2)); //perque el modul de la velocitat sigui el que ha de ser ja que sino aniria mes ràpid en diagonal
                this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else if(this.cursors.W.isDown){
                this.player.rotation=-0.785;
                this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else{
                this.player.rotation=0;
                this.player.setVelocityX(this.player.velocitat);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.A.isDown){
            if(this.player.accio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.accio="esquerra";
            if(this.cursors.S.isDown){
                this.player.rotation=2.355;
                this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else if(this.cursors.W.isDown){
                this.player.rotation=4.15;
                this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat,2)/2)); 
                this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat,2)/2));
            }
            else{
                this.player.rotation=3.14;
                this.player.setVelocityX(-this.player.velocitat);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.S.isDown){
            if(this.player.accio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.accio="avall";
            this.player.rotation=1.57;
            this.player.setVelocityY(this.player.velocitat);
            this.player.setVelocityX(0);
        } 
        else if(this.cursors.W.isDown){
            if(this.player.accio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.accio="amunt";
            this.player.rotation=-1.57;
            this.player.setVelocityY(-this.player.velocitat);
            this.player.setVelocityX(0);
        } 
        else{//no es presiona cap tecla de moviment
            if (this.player.accio!="quiet"){
                this.player.accio="quiet";
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
                this.player.anims.play('quiet_ma');
            }
        }
    }
}

