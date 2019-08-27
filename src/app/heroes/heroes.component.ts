import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
// import { HEROES } from '../mock-heroes';//未使用服务时单独获取服务的文件

import { HeroService } from '../hero.service';//引入英雄数据服务



@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // heroes = HEROES;
  // selectedHero: Hero;

  heroes: Hero[];
  
  /**
   * 
   * @param heroService 将服务heroService在constructor中注入
   * 这个参数同时做了两件事：
   *    1. 声明了一个私有 heroService 属性，
   *    2. 把它标记为一个 HeroService 的注入点。
   */
  constructor(private heroService: HeroService){ }

  ngOnInit() {
    this.getHeroes();
  }

  /**
   * 
   * @param hero 选择英雄
   */
  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  // }

  /**
   * 1、
   * 从服务中获取英雄数据
   *   返回一个 Hero[]
   */
  // getHeroes(): void{
  //   this.heroes = this.heroService.getHeroes();
  // }

  /**
   * 2、
   * 模拟从远程服务端获取数据
   *    返回的是Observable<Hero[]>
   */
  getHeroes(): void{
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
  /**
   * 总结：
   * 
   * Observable.subscribe() 是关键的差异点。
   * 
   * 上一个版本把英雄的数组赋值给了该组件的 heroes 属性。 这种赋值是同步的，这里包含的假设是服务器能立即返回英雄数组或者浏览器能在等待服务器响应时冻结界面。
   * 
   * 当 HeroService 真的向远端服务器发起请求时，这种方式就行不通了。
   * 
   * 新的版本等待 Observable 发出这个英雄数组，这可能立即发生，也可能会在几分钟之后。 然后，subscribe 函数把这个英雄数组传给这个回调函数，该函数把英雄数组赋值给组件的 heroes 属性。
   * 
   * 使用这种异步方式，当 HeroService 从远端服务器获取英雄数据时，就可以工作了。
   */

  
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
