import { Component, OnInit } from '@angular/core';
import {Post, PostType} from '../reddit/post'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor() { }

  samplePosts = [
    new Post("0", PostType.Link, null, "Sample Image", "https://i.redd.it/4r4owza1yz661.jpg", "https://b.thumbs.redditmedia.com/CyV8swMQlLF5_y-lrEBfZbMOJ2L5Y71Gc4Ak8BVyMAU.jpg", "https://i.redd.it/4r4owza1yz661.jpg"),
    new Post("1", PostType.Link, null, "Sample Text").setText(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a eros euismod, dignissim est a, interdum ex. Proin congue ligula nec pharetra accumsan. Morbi nec diam mi. Proin vel nisi nec sapien imperdiet viverra quis nec ligula. Nullam eget laoreet lorem. Maecenas dignissim ultrices ligula, vitae imperdiet massa auctor nec. Donec at quam sit amet neque placerat fermentum. Pellentesque quis dapibus arcu, et condimentum neque. Nam sollicitudin ante diam, porta finibus diam bibendum non. Nam lacinia eleifend nulla in feugiat. Cras et ipsum commodo, bibendum nulla in, iaculis mauris. Sed imperdiet pharetra sapien at euismod.

    Proin semper dui eget porta iaculis. Nullam urna sapien, vestibulum quis imperdiet et, porta a leo. Quisque sodales placerat lectus, ut ultricies dui euismod sed. Vestibulum lorem diam, iaculis quis semper non, molestie eu nibh. Praesent faucibus faucibus molestie. Curabitur vehicula lacinia nibh ut pharetra. In at risus eros. Etiam semper diam venenatis massa mollis, id cursus ante finibus.
    
    Ut id pulvinar massa. Nam ullamcorper purus et enim laoreet facilisis. Curabitur velit tellus, imperdiet ac viverra eget, tristique et nulla. Donec felis velit, vestibulum quis hendrerit sit amet, accumsan a lacus. Quisque tincidunt egestas laoreet. Integer quis tortor et sem venenatis scelerisque non in augue. Vivamus neque orci, posuere eu lacus in, mattis convallis sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In vel ante et mauris fermentum malesuada et at metus. Proin ut blandit nisl. Fusce sapien metus, mattis non placerat eu, rutrum a est. Sed sit amet mollis nisi. Nunc ipsum diam, luctus nec dapibus quis, lacinia vel felis. Duis eu efficitur libero, ac consequat magna.
    
    Praesent bibendum odio a magna tincidunt, sed tempor lacus congue. Sed tristique a justo et venenatis. Integer ipsum nisl, ultrices sed dui nec, convallis volutpat quam. Maecenas ac varius augue. Duis rutrum massa eu lacus gravida ornare. Vivamus rutrum interdum massa, a ultrices nulla ornare sed. Cras eget rhoncus libero. In hac habitasse platea dictumst. Nulla eu dolor luctus, tempus justo ac, volutpat nibh. Sed nunc augue, vulputate lobortis purus ut, vehicula imperdiet dui. Curabitur nec justo sit amet neque posuere luctus. Phasellus eget ultricies velit. Quisque posuere ornare sem, in ornare ex dapibus vitae. Sed sagittis nulla eu massa faucibus eleifend id vel tellus. Vivamus turpis elit, consequat non dictum ut, dictum et ipsum.
    
    Sed consequat, diam nec finibus congue, lacus leo pretium nisi, sit amet vehicula purus sapien sed urna. Integer nec nulla massa. Cras semper venenatis risus nec blandit. Sed tristique est in euismod auctor. Nam ante justo, tristique a ante sed, elementum egestas odio. Maecenas pulvinar lacus ex, a elementum leo accumsan ut. Suspendisse pharetra gravida metus in lacinia. In hac habitasse platea dictumst. Aenean sit amet libero elementum, condimentum lacus non, cursus leo. Donec et finibus libero. Sed facilisis mollis feugiat. Sed eu sapien egestas, suscipit urna et, tincidunt lectus. Aenean vehicula feugiat orci eu semper.`),
    new Post("2",PostType.Link,null,"Link Post","https://google.com/")
  ];

  ngOnInit(): void {
  }

}