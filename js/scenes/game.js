class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.player=null;
        this.cursors=null;
    }

    preload (){	
        this.load.spritesheet('ma_caminar','../../resources/sense_arma/caminar_ma.png',{frameWidth: 279, frameHeight: 219});
        this.load.spritesheet('ma_quiet','../../resources/sense_arma/quiet_ma.png',{frameWidth: 289, frameHeight: 224});
	}
	
    create (){	
        this.player = this.physics.add.sprite(400,300,'ma_caminar').setScale(0.25).refreshBody();
        this.player.setBounce(0.2);
        this.player.direccio="quiet";
        this.player.rotation=0.5;
        


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
        this.player.anims.play('quiet_ma');



        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.D=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D,true,true);
        this.cursors.A=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A,true,true);
        this.cursors.S=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S,true,true);
        this.cursors.W=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W,true,true);

	}
	
	update (){	
        if(this.cursors.D.isDown){
            if(this.player.direccio=="quiet"){
                 this.player.anims.play('caminar_ma');
            }
            this.player.direccio="dreta";
            if(this.cursors.S.isDown){
                this.player.rotation=1.285;
                this.player.setVelocityX(70.7); //perque el modul de la velocitat sigui 100
                this.player.setVelocityY(70.7);
            }
            else if(this.cursors.W.isDown){
                this.player.rotation=-0.285;
                this.player.setVelocityX(70.7); //perque el modul de la velocitat sigui 100
                this.player.setVelocityY(-70.7);
            }
            else{
                this.player.rotation=0.5;
                this.player.setVelocityX(100);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.A.isDown){
            if(this.player.direccio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.direccio="esquerra";
            if(this.cursors.S.isDown){
                this.player.rotation=2.855;
                this.player.setVelocityX(-70.7); //perque el modul de la velocitat sigui 100
                this.player.setVelocityY(70.7);
            }
            else if(this.cursors.W.isDown){
                this.player.rotation=4.45;
                this.player.setVelocityX(-70.7); //perque el modul de la velocitat sigui 100
                this.player.setVelocityY(-70.7);
            }
            else{
                this.player.rotation=3.64;
                this.player.setVelocityX(-100);
                this.player.setVelocityY(0);
            }
        } 
        else if(this.cursors.S.isDown){
            if(this.player.direccio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.direccio="avall";
            this.player.rotation=2.07;
            this.player.setVelocityY(100);
            this.player.setVelocityX(0);
        } 
        else if(this.cursors.W.isDown){
            if(this.player.direccio=="quiet"){
                this.player.anims.play('caminar_ma');
            }
            this.player.direccio="amunt";
            this.player.rotation=-1.07;
            this.player.setVelocityY(-100);
            this.player.setVelocityX(0);
        } 
        else{//no es presiona cap tecla de moviment
            if (this.player.direccio!="quiet"){
                this.player.direccio="quiet";
                this.player.setVelocityY(0);
                this.player.setVelocityX(0);
                this.player.anims.play('quiet_ma');
            }
        }
    }
}

