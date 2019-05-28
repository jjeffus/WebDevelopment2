import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { PopoverController, NavController, Platform} from '@ionic/angular';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
// document.addEventListener('deviceready', function() {
//   window.sqlitePlugin.echoTest(function() {
//     console.log('ECHO test OK');
//   });
// });

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public storage: SQLite;
  public itemList: Array<Object>;

  logScrollStart(){
    console.log("logScrollStart : When Scroll Starts");
  }

  logScrolling(){
    console.log("logScrolling : When Scrolling");
  }

  logScrollEnd(){
    console.log("logScrollEnd : When Scroll Ends");
  }

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public platform: Platform, private sqlite: SQLite, private sqliteDbCopy: SqliteDbCopy) {
    this.itemList = [];
    this.platform.ready().then(() => {
      // window.plugins.sqlDB.remove("bible-sqlite.db", 0, (e) => console.log("success", e), (e) => console.log("error", e));
      this.sqliteDbCopy.copy("bible-sqlite.db", 0)
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
      this.sqlite.create({
        name: "bible-sqlite.db",
        location: 'default',
        createFromLocation: 1,
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT name FROM  sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'", []).then((data) => {
          console.log("tables", data);
        });
        db.executeSql("select * from t_web where b=1 and c=1", [])
          .then((data) => {
            console.log('Executed SQL', data);
            let rows = data.rows;
            for (let i = 0; i < rows.length; i++) {
              this.itemList.push({
                id: rows.item(i).id,
                v: rows.item(i).v,
                c: rows.item(i).c,
                t: rows.item(i).t
              });
            }
          })
          .catch(e => console.log(e));
        })
      .catch(e => console.log(e));
    });
  }
}
