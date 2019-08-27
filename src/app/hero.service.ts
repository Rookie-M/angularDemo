import { Injectable } from '@angular/core';

import { Hero } from './hero';
// import { HEROES } from './mock-heroes';

import { Observable, of } from 'rxjs';//Observable 是 RxJS 库中的一个关键类

import { MessageService } from './message.service';//引入消息服务

import { HttpClient, HttpHeaders } from '@angular/common/http';//导入一些所需的 HTTP 符号

/**
 * 凡事皆会出错，特别是当你从远端服务器获取数据的时候。 HeroService.getHeroes() 方法应该捕获错误，并做适当的处理。
 * 要捕获错误，你就要使用 RxJS 的 catchError() 操作符来建立对 Observable 结果的处理管道（pipe）。
 * 从 rxjs/operators 中导入 catchError 符号，以及你稍后将会用到的其它操作符。
 */
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  

  /**
   * 
   * @param messageService 
   * 这是一个典型的“服务中的服务”场景： 你把 MessageService 注入到了 HeroService 中，而 HeroService 又被注入到了 HeroesComponent 中。
   */
  constructor(
    private messageService: MessageService,
    private http: HttpClient,//把 HttpClient 注入到构造函数中一个名叫 http 的私有属性中。

    // private log(message: string) {
    //   this.messageService.add(`HeroService:${message}`)
    // },
  ) { }
    private heroesUrl = 'api/heroes'

  /**
   * 新加一个getHeroes方法，用来获取mock-heroes文件中的数据，将来在heroes组件中使用这些数据
   */
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  /**
   * 相对于上方的方法写法而言，上方的函数签名是同步，而下方的写法是创建了具有某种形式的异步函数签名，模拟从服务器获取数据
   * 使用 RxJS 的 of() 函数来模拟从服务器返回数据
   */
  // getHeroes(): Observable<Hero[]> {
  //   return of(HEROES);
  // }

  /**
   * 在获取到英雄数组时发送一条消息
   */
  // getHeroes(): Observable<Hero[]> {
  //   this.messageService.add('HeroService: fetched heroes');
  //   return of(HEROES);
  // }
  /**
   * 上述方法转换成使用 HttpClient 的
  */
  // getHeroes(): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  // }
  /**
   * 
   * 上述方法进行错误处理的扩展
   */
  // getHeroes(): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  //     .pipe(
  //       catchError(this.handleError<Hero[]>('getHeroes', []))
  //     );
  // }
  /**
   * 最终版本
   * getHeroes 的最终版本，它使用 tap 来记录各种操作
   */
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
/**
 * 这里的 baseURL 就是在 英雄列表与 HTTP 部分定义过的 heroesURL（api/heroes）。而 id 则是你要获取的英雄的编号，比如，api/heroes/11。 添加一个 HeroService.getHero() 方法，以发起该请求：
 */
  // getHero(id: number): Observable<Hero>{
  //   this.messageService.add(`HeroService: fetched hero id = ${id}`);
  //   return of(HEROES.find(hero => hero.id === id));
  // }
  /**
   * 
   * 这里和 getHeroes() 相比有三个显著的差异:
   *      它使用想获取的英雄的 id 构建了一个请求 URL。
   *      服务器应该使用单个英雄作为回应，而不是一个英雄数组。
   *      所以，getHero 会返回 Observable<Hero>（“一个可观察的单个英雄对象”），而不是一个可观察的英雄对象数组。
   */

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**
   * updateHero() 的总体结构和 getHeroes() 很相似，但它会使用 http.put() 来把修改后的英雄保存到服务器上
   * HttpClient.put() 方法接受三个参数
   *    URL 地址
   *    要修改的数据（这里就是修改后的英雄）
   *    选项
   */
  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   *
   * HeroService.addHero() 和 updateHero 有两点不同。
   * 它调用 HttpClient.post() 而不是 put()。
   * 它期待服务器为这个新的英雄生成一个 id，然后把它通过 Observable<Hero> 返回给调用者。
   */
  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /**
   * 注意
   * 它调用了 HttpClient.delete。
   * URL 就是英雄的资源 URL 加上要删除的英雄的 id。
   * 你不用像 put 和 post 中那样发送任何数据。
   * 你仍要发送 httpOptions。
   */
  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
