import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/**
 * 添加路由定义
 * 路由定义 会告诉路由器，当用户点击某个链接或者在浏览器地址栏中输入某个 URL 时，要显示哪个视图。
 * 典型的 Angular 路由（Route）有两个属性：
 *    1、path：一个用于匹配浏览器地址栏中 URL 的字符串。
 *    2、component：当导航到此路由时，路由器应该创建哪个组件。
 * 如果你希望当 URL 为 localhost:4200/heroes 时，就导航到 HeroesComponent。
 * 首先要导入 HeroesComponent，以便能在 Route 中引用它。 然后定义一个路由数组，其中的某个路由是指向这个组件的。
 */
import { HeroesComponent } from '../app/heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';


const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  /**
   * path 中的冒号（:）表示 :id 是一个占位符，它表示某个特定英雄的 id。
   */
  { path: 'detail/:id', component: HeroDetailComponent },
  /**
   * 当应用启动时，浏览器的地址栏指向了网站的根路径。 它没有匹配到任何现存路由，因此路由器也不会导航到任何地方。 
   * <router-outlet> 下方是空白的。要让应用自动导航到这个仪表盘，请把下列路由添加到 AppRoutingModule.Routes 数组中。
   * 这个路由会把一个与空路径“完全匹配”的 URL 重定向到路径为 '/dashboard' 的路由。
   * 浏览器刷新之后，路由器加载了 DashboardComponent，并且浏览器的地址栏会显示出 / dashboard 这个 URL。
   */
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

/**
 * 你通常不会在路由模块中声明组件，所以可以删除 @NgModule.declarations 并删除对 CommonModule 的引用。
 * 
 * 你将会使用 RouterModule 中的 Routes 类来配置路由器，所以还要从 @angular/router 库中导入这两个符号。
 * 
 * 添加一个 @NgModule.exports 数组，其中放上 RouterModule 。 导出 RouterModule 让路由器的相关指令可以在 AppModule 中的组件中使用。
 * 
 * 【注】你必须首先初始化路由器，并让它开始监听浏览器中的地址变化，把 RouterModule 添加到 @NgModule.imports 数组中，并用 routes 来配置它。你只要调用 imports 数组中的 RouterModule.forRoot() 函数就行了。（这个方法之所以叫 forRoot()，是因为你要在应用的顶级配置这个路由器。 forRoot() 方法会提供路由所需的服务提供商和指令，还会基于浏览器的当前 URL 执行首次导航。）
 */
@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  // exports: [RouterModule]
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
