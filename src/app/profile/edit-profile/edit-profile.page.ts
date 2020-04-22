import { Component, OnInit, OnDestroy } from '@angular/core';
import { Userinfo } from 'src/app/userinfo.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserinfoService } from 'src/app/userinfo.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  userinfo: Userinfo;
  userinfoId: string;
  form: FormGroup;
  isLoading = false;
  private userinfoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userinfoService: UserinfoService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userinfoId')) {
        this.navCtrl.navigateBack('/tabs/tab/profile');
        return;
      }
      this.userinfoId = paramMap.get('userinfoId');
      this.isLoading = true;
      this.userinfoSub = this.userinfoService
        .getUserinfo(paramMap.get('userinfoId'))
        .subscribe(
          userInfo => {
            this.userinfo = userInfo;
            this.form = new FormGroup({
              name: new FormControl(this.userinfo.name, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(18)]
              }),
              photo: new FormControl(null)
                // {
                // updateOn: 'blur',
                // validators: [Validators.required]
              // })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Info could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/tabs/tab/profile']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }

  onUpdateUserInfo() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.userinfoService
        .uploadImage(this.form.get('photo').value)
        .pipe(
          switchMap( uploadRes => {
            return this.userinfoService
              .updateUserInfo(
                this.userinfo.id,
                this.form.value.name,
                uploadRes.imageUrl
              );
          })
        )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/tabs/tab/profile']);
          });
      });
  }

  ngOnDestroy() {
    if (this.userinfoSub) {
      this.userinfoSub.unsubscribe();
    }
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/png;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ photo: imageFile });
  }



}
