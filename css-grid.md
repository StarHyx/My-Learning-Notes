# CSS网格系统学习笔记

[一个有趣地学习网格系统的游戏](https://cssgridgarden.com/#zh-cn)

其中一件事情使CSS网格布局和Flex盒布局不同的是，你可以很轻松的在二维的空间里定位一个网格项: 行和列。`grid-row-start`就像`grid-column-start`一样，只不过是在垂直方向指定起始位置。

`grid-column/row-start/end`: 指定网格中每一个列/行的起始/最终位置

如果你想要从右边数网格的列数而不是从左边数，你可以设置`grid-column-start`和`grid-column-end`为负值。比如说，你可以设置它为-1来指定为右边的第一列。

你可以根据网格的开始和结束位置来定义一个网格项，你也可以用`span`关键词来指定你所要跨越的宽度。请注意`span`只能是正值。

如果每次都输入`grid-column-start`和`grid-column-end`两个属性，我们一定会厌烦的。幸运的是，`grid-column`是一个缩写形式，它可以一次接受两个值，只要用'/'分开就好。

比如说：`grid-column: 2 / 4`;就会设置网格项从第二列开始，到第四列结束。

如果你觉得同时输入`grid-column`和`grid-row`也很复杂，我们还有另一种缩写。`grid-area`属性接受4个由'/'分开的值：`grid-row-start`, `grid-column-start`, `grid-row-end`, 最后是`grid-column-end`。
举个例子：grid-area: `1 / 1 / 3 / 6`;。

如果网格项不是以`grid-area`、`grid-column`、`grid-row` 等显示的，它们会自动按照它们在源程序中出现的位置摆放。同样我们也可以使用`order`属性来重写它的顺序，这也是网格布局优于表格布局的好处之一。
默认情况下，所有的网格项的`order`都是0，但是顺序也可以被任意设置为正数或者负数，就像z-index一样。

指定一些具有相同宽度的网格项会变得很乏味。幸运的是有repeat函数来帮助我们。
比如说，之前我们使用`grid-template-columns: 20% 20% 20% 20% 20%`;属性定义了5列，每列占20%。这可以被简写为：`grid-template-columns: repeat(5, 20%)`;

`grid-template-columns`不仅仅只接受百分比的值，也接受像像素或`em`这样的长度单位。你甚至可以将不同的长度单位混合使用。

网格系统也引入了一个新的单位，分数`fr`。每一个`fr`单元分配一个可用的空间。比如说，如果两个元素分别被设置为`1fr`和`3fr`，那么空间就会被平均分配为4份；第一个元素占据`1/4`，第二个元素占据`3/4`。

当列的宽度采用`像素`，`百分比`或者`em`的单位的时候，其他使用`fr`单位设置的列将会平分剩下的空间。

`grid-template`是`grid-template-rows`和`grid-template-columns`的缩写形式。

比如说，`grid-template: 50% 50% / 200px`;将创建一个具有两行的网格，每一行占据50%，以及一个200像素宽的列。