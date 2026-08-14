(() => {
const records = [
  { id:'silence', type:'film', typeZh:'电影', title:'沉默的羔羊', original:'The Silence of the Lambs', year:'1991', score:'IMDb 8.6', signal:'一场不眨眼的对话', tags:'心理 探案 牢房', summary:'新手探员与一位极擅长阅读人心的囚犯交换线索。真正令人屏息的，并不是案发现场，而是那两人隔着玻璃说话的时刻。', link:'https://www.imdb.com/title/tt0102926/', art:'static', path:'detective' },
  { id:'se7en', type:'film', typeZh:'电影', title:'七宗罪', original:'Se7en', year:'1995', score:'IMDb 8.6', signal:'雨从未停过', tags:'雨夜 探案 城市', summary:'两名警探追着一套精确到令人窒息的规则穿过阴雨城市。它的节奏像一扇逐渐合拢的铁门。', link:'https://www.imdb.com/title/tt0114369/', art:'corridor', path:'detective' },
  { id:'psycho', type:'film', typeZh:'电影', title:'惊魂记', original:'Psycho', year:'1960', score:'IMDb 8.5', signal:'汽车驶离公路', tags:'旅馆 身份 黑白', summary:'一段临时改道的旅程，把人带到一间路边旅馆。希区柯克让观众比角色更早感到事情不对，但永远晚一步明白为什么。', link:'https://www.imdb.com/title/tt0054215/', art:'theatre', path:'sealed' },
  { id:'shining', type:'film', typeZh:'电影', title:'闪灵', original:'The Shining', year:'1980', score:'IMDb 8.4', signal:'雪封住出口', tags:'酒店 冬天 家庭', summary:'一座季节性关闭的酒店，在漫长冬天里一点点改变了看守者的表情。走廊、地毯与空房间都记得比人更多。', link:'https://www.imdb.com/title/tt0081505/', art:'corridor', path:'sealed' },
  { id:'thing', type:'film', typeZh:'电影', title:'怪形', original:'The Thing', year:'1982', score:'IMDb 8.2', signal:'谁还是真的？', tags:'极地 封闭 信任', summary:'南极基地里，最可怕的不是外面降到极限的温度，而是队伍再也无法判断彼此是否还是原来那个人。', link:'https://www.imdb.com/title/tt0084787/', art:'static', path:'sealed' },
  { id:'others', type:'film', typeZh:'电影', title:'小岛惊魂', original:'The Others', year:'2001', score:'IMDb 7.6', signal:'窗帘不能拉开', tags:'旧宅 雾气 孩子', summary:'一位母亲在雾中的大宅里守着对阳光极敏感的孩子。每一声脚步都像从很远的地方传来。', link:'https://www.imdb.com/title/tt0230600/', art:'corridor', path:'sealed' },
  { id:'sixth', type:'film', typeZh:'电影', title:'第六感', original:'The Sixth Sense', year:'1999', score:'IMDb 8.2', signal:'孩子不想睡', tags:'童年 医生 低语', summary:'一位儿童心理医生试图帮助一个总是紧张望向角落的男孩。温柔的叙事让每个寻常房间都带上了另一层意思。', link:'https://www.imdb.com/title/tt0167404/', art:'theatre', path:'mind' },
  { id:'cure', type:'film', typeZh:'电影', title:'CURE', original:'キュア / Cure', year:'1997', score:'IMDb 7.4', signal:'你是谁？', tags:'东京 催眠 失忆', summary:'一连串表面毫无联系的案件，被一个不断重复的简单问题牵在一起。它的安静，比任何声响都更难摆脱。', link:'https://www.imdb.com/title/tt0123948/', art:'cure', path:'mind' },
  { id:'wailing', type:'film', typeZh:'电影', title:'哭声', original:'The Wailing', year:'2016', score:'IMDb 7.4', signal:'山路尽头的陌生人', tags:'村庄 传闻 仪式', summary:'偏远村落接连发生怪事，警察越调查，所有人的说法越像在把他推向不同方向。', link:'https://www.imdb.com/title/tt5215952/', art:'corridor', path:'town' },
  { id:'handmaiden', type:'film', typeZh:'电影', title:'小姐', original:'The Handmaiden', year:'2016', score:'IMDb 8.1', signal:'每个人都藏着剧本', tags:'骗局 庄园 反转', summary:'一桩精致骗局进入日式庄园后，叙述权开始悄悄易手。美丽的布景背后，每个人都在重新安排自己的位置。', link:'https://www.imdb.com/title/tt4016934/', art:'theatre', path:'detective' },
  { id:'memories', type:'film', typeZh:'电影', title:'杀人回忆', original:'Memories of Murder', year:'2003', score:'IMDb 8.1', signal:'田野里的雨', tags:'乡野 探案 未解', summary:'小镇警员面对没有答案的连续案件。它最锋利的地方，是把失败与无力拍得如此具体。', link:'https://www.imdb.com/title/tt0353969/', art:'corridor', path:'detective' },
  { id:'invisible', type:'film', typeZh:'电影', title:'看不见的客人', original:'Contratiempo', year:'2016', score:'IMDb 8.0', signal:'最后一次供述', tags:'密室 供词 反转', summary:'一间封闭房间、一次严苛的梳理与不断改写的证词。适合不想暂停、想一口气走到最后的人。', link:'https://www.imdb.com/title/tt4857264/', art:'theatre', path:'detective' },
  { id:'shutter', type:'film', typeZh:'电影', title:'禁闭岛', original:'Shutter Island', year:'2010', score:'IMDb 8.2', signal:'灯塔没有回答', tags:'孤岛 医院 记忆', summary:'一位警探登上风暴中的岛屿，调查失踪案。岛上的每个人似乎都知道某些他还没想起来的事。', link:'https://www.imdb.com/title/tt1130884/', art:'static', path:'mind' },
  { id:'prestige', type:'film', typeZh:'电影', title:'致命魔术', original:'The Prestige', year:'2006', score:'IMDb 8.5', signal:'你看漏了什么', tags:'舞台 宿敌 技法', summary:'两位魔术师让竞争越过边界。故事从一开始就提醒你：每个把戏都有承诺、转折与结果。', link:'https://www.imdb.com/title/tt0482571/', art:'theatre', path:'mind' },
  { id:'letin', type:'film', typeZh:'电影', title:'生人勿进', original:'Let the Right One In', year:'2008', score:'IMDb 7.8', signal:'雪地上的脚印', tags:'北欧 童年 冬夜', summary:'冬天的居民区里，两个总在边缘的孩子建立了关系。它冷静、克制，也因此格外锋利。', link:'https://www.imdb.com/title/tt1139797/', art:'corridor', path:'sealed' },
  { id:'getout', type:'film', typeZh:'电影', title:'逃出绝命镇', original:'Get Out', year:'2017', score:'IMDb 7.8', signal:'微笑太整齐', tags:'拜访 家庭 失控', summary:'一次去见恋人父母的周末行程，逐渐显出不自然的礼貌与被安排好的秩序。', link:'https://www.imdb.com/title/tt5052448/', art:'theatre', path:'town' },

  { id:'truedetective', type:'series', typeZh:'剧集', title:'真探', original:'True Detective · S01', year:'2014', score:'IMDb 8.9', signal:'平原上的符号', tags:'双线 探案 南方', summary:'两位警探、多年跨度与一桩始终没有安静下来的旧案。第一季像一条被遗忘在沼泽里的录音带。', link:'https://www.imdb.com/title/tt2356777/', art:'corridor', path:'detective' },
  { id:'twinpeaks', type:'series', typeZh:'剧集', title:'双峰', original:'Twin Peaks', year:'1990', score:'IMDb 8.8', signal:'咖啡还热着', tags:'小镇 梦境 红色帘幕', summary:'有人在宁静小镇外被发现，而每个热心的邻居都像比表面多知道一点。梦境在这里不是逃离现实的地方。', link:'https://www.imdb.com/title/tt0098936/', art:'theatre', path:'town' },
  { id:'dark', type:'series', typeZh:'剧集', title:'暗黑', original:'Dark', year:'2017', score:'IMDb 8.7', signal:'洞口通向何时', tags:'小镇 时间 家族', summary:'孩童失踪让四个家族翻开了多年以前的一页。把人物关系图放在手边，会让这趟旅程更完整。', link:'https://www.imdb.com/title/tt5753856/', art:'static', path:'mind' },
  { id:'hannibal', type:'series', typeZh:'剧集', title:'汉尼拔', original:'Hannibal', year:'2013', score:'IMDb 8.5', signal:'晚餐请准时', tags:'心理 医生 美学', summary:'侧写师与心理医生之间的谈话，像一盘永远端得过于漂亮的菜。每一帧都值得停下来细看。', link:'https://www.imdb.com/title/tt2243973/', art:'theatre', path:'mind' },
  { id:'mindhunter', type:'series', typeZh:'剧集', title:'心灵猎人', original:'Mindhunter', year:'2017', score:'IMDb 8.6', signal:'录音机开始转动', tags:'访谈 行为 档案', summary:'两名探员开始记录那些极端行为者如何理解自己。真正的张力常常只存在于采访室里。', link:'https://www.imdb.com/title/tt5290382/', art:'static', path:'detective' },
  { id:'hillhouse', type:'series', typeZh:'剧集', title:'鬼入侵', original:'The Haunting of Hill House', year:'2018', score:'IMDb 8.5', signal:'家没有离开你', tags:'旧宅 家庭 余波', summary:'多年后回看那所房子，一家人才发现各自记得的并不是同一件事。它把情感创伤放进了一栋会呼吸的建筑里。', link:'https://www.imdb.com/title/tt6763664/', art:'corridor', path:'sealed' },
  { id:'blackmirror', type:'series', typeZh:'剧集', title:'黑镜', original:'Black Mirror', year:'2011', score:'IMDb 8.7', signal:'屏幕亮了一下', tags:'科技 寓言 单元', summary:'独立单元把稍微往前一步的技术，推到每个人都不愿承认会发生的地方。适合随时抽一集。', link:'https://www.imdb.com/title/tt2085059/', art:'static', path:'mind' },
  { id:'riget', type:'series', typeZh:'剧集', title:'医院风云', original:'Riget / The Kingdom', year:'1994', score:'IMDb 8.2', signal:'地下室有人说话', tags:'医院 荒诞 北欧', summary:'一间看似讲求理性的医院，总有不合常理的声音从地下传上来。它怪异得像一场醒着的梦。', link:'https://www.imdb.com/title/tt0108906/', art:'static', path:'sealed' },
  { id:'terror', type:'series', typeZh:'剧集', title:'极地恶灵', original:'The Terror · S01', year:'2018', score:'IMDb 7.9', signal:'冰层不会让路', tags:'远征 极地 孤立', summary:'被冰困住的远征队，必须面对食物、疾病、天气与一种尚未被命名的威胁。', link:'https://www.imdb.com/title/tt2708480/', art:'corridor', path:'sealed' },
  { id:'beyondevil', type:'series', typeZh:'剧集', title:'怪物', original:'Beyond Evil', year:'2021', score:'IMDb 8.1', signal:'谁把过去埋了', tags:'韩剧 小镇 刑警', summary:'新刑警来到小镇，与一位不按规则出牌的前辈重查旧案。每个人的日常都带着被折叠过的痕迹。', link:'https://www.imdb.com/title/tt13634872/', art:'theatre', path:'town' },
  { id:'marianne', type:'series', typeZh:'剧集', title:'魔鬼时刻', original:'The Devil\'s Hour', year:'2022', score:'IMDb 7.6', signal:'03:33', tags:'循环 梦境 失踪', summary:'一位母亲总在凌晨固定时刻醒来，而她的生活似乎与一桩案件有着无法解释的重叠。', link:'https://www.imdb.com/title/tt14379784/', art:'static', path:'mind' },

  { id:'monster', type:'anime', typeZh:'动画', title:'怪物', original:'MONSTER', year:'2004', score:'IMDb 8.7', signal:'你救下了谁', tags:'医生 欧洲 追踪', summary:'一位天才外科医生在做出职业上正确的选择后，花了很多年追问那一刻究竟改变了什么。', link:'https://www.imdb.com/title/tt0434706/', art:'corridor', path:'mind' },
  { id:'perfectblue', type:'anime', typeZh:'动画电影', title:'未麻的部屋', original:'Perfect Blue', year:'1997', score:'IMDb 8.0', signal:'镜子先回答', tags:'偶像 身份 都市', summary:'当舞台身份、旁人的凝视与私人生活混在一起，一个人究竟如何确认自己仍在掌控自己的叙事？', link:'https://www.imdb.com/title/tt0156887/', art:'static', path:'mind' },
  { id:'paranoia', type:'anime', typeZh:'动画', title:'妄想代理人', original:'Paranoia Agent', year:'2004', score:'IMDb 8.0', signal:'金色球棒', tags:'都市 传言 群像', summary:'同一个都市传言，在不同人心里长成不同的形状。今敏把焦虑画成一件会传染的事。', link:'https://www.imdb.com/title/tt0433722/', art:'static', path:'town' },
  { id:'erased', type:'anime', typeZh:'动画', title:'只有我不在的街道', original:'ERASED', year:'2016', score:'IMDb 8.4', signal:'回到那个冬天', tags:'时间 童年 救援', summary:'成年男子意外回到童年，试着改变一位同学的命运。悬念在时间与记忆之间来回收紧。', link:'https://www.imdb.com/title/tt5249462/', art:'theatre', path:'detective' },
  { id:'deathnote', type:'anime', typeZh:'动画', title:'死亡笔记', original:'DEATH NOTE', year:'2006', score:'IMDb 8.9', signal:'名字被写下', tags:'推理 对弈 天才', summary:'一本能改变生死的笔记本落在优秀学生手里，两位极端聪明的人从此隔空对弈。', link:'https://www.imdb.com/title/tt0877057/', art:'theatre', path:'detective' },
  { id:'higurashi', type:'anime', typeZh:'动画', title:'寒蝉鸣泣之时', original:'Higurashi When They Cry', year:'2006', score:'IMDb 7.8', signal:'祭典后的沉默', tags:'村庄 循环 祭典', summary:'安静村庄的夏季祭典过后，总有人不见。可怕的不是答案，而是故事总会回到原点。', link:'https://www.imdb.com/title/tt0451954/', art:'corridor', path:'town' },
  { id:'madeinabyss', type:'anime', typeZh:'动画', title:'来自深渊', original:'Made in Abyss', year:'2017', score:'IMDb 8.3', signal:'向下没有返程', tags:'深渊 探索 冒险', summary:'两名孩子走进巨大竖穴的深处。越往下，世界越瑰丽，回去的代价也越清晰。', link:'https://www.imdb.com/title/tt7222080/', art:'corridor', path:'sealed' },
  { id:'lain', type:'anime', typeZh:'动画', title:'玲音', original:'Serial Experiments Lain', year:'1998', score:'IMDb 8.0', signal:'你在线吗', tags:'网络 自我 90年代', summary:'一封来自已离开同学的电子邮件，让少女开始怀疑现实、网络与自我的边界。', link:'https://www.imdb.com/title/tt0500092/', art:'static', path:'mind' },
  { id:'promised', type:'anime', typeZh:'动画', title:'约定的梦幻岛', original:'The Promised Neverland · S01', year:'2019', score:'IMDb 8.2', signal:'墙外是什么', tags:'孤儿院 逃离 智斗', summary:'孩子们发现温馨的孤儿院里有一条不能被大人听见的规则。第一季像一场精密而轻盈的越狱。', link:'https://www.imdb.com/title/tt8788458/', art:'theatre', path:'sealed' },

  { id:'houseleaves', type:'book', typeZh:'小说', title:'叶之屋', original:'House of Leaves', year:'2000', score:'GR 4.1', signal:'房子里面更大', tags:'手稿 建筑 迷宫', summary:'一部关于一所内部空间无法测量的房子的手稿，又被多重注释与碎片叙事包围。请为它预留足够安静的夜晚。', link:'https://openlibrary.org/search?q=House+of+Leaves', art:'corridor', path:'sealed' },
  { id:'rebecca', type:'book', typeZh:'小说', title:'蝴蝶梦', original:'Rebecca', year:'1938', score:'GR 4.2', signal:'她还在庄园里', tags:'庄园 婚姻 往事', summary:'年轻新娘走进丈夫的海边庄园，却发现一个从未见过的前任，仍然掌握着屋里所有人的动作。', link:'https://openlibrary.org/search?q=Rebecca+Daphne+du+Maurier', art:'theatre', path:'sealed' },
  { id:'andthen', type:'book', typeZh:'小说', title:'无人生还', original:'And Then There Were None', year:'1939', score:'GR 4.3', signal:'名单少了一人', tags:'孤岛 推理 倒数', summary:'十位陌生人受邀登岛，一首童谣开始一条条兑现。它是封闭空间推理最干净利落的入口之一。', link:'https://openlibrary.org/search?q=And+Then+There+Were+None', art:'theatre', path:'detective' },
  { id:'roger', type:'book', typeZh:'小说', title:'罗杰疑案', original:'The Murder of Roger Ackroyd', year:'1926', score:'GR 4.2', signal:'叙述也会撒谎', tags:'庄园 阿加莎 诡计', summary:'一个乡村庄园的案件，被波洛带回看似平静的日常。请尽量别提前搜索任何内容。', link:'https://openlibrary.org/search?q=The+Murder+of+Roger+Ackroyd', art:'theatre', path:'detective' },
  { id:'suspectx', type:'book', typeZh:'小说', title:'嫌疑人X的献身', original:'The Devotion of Suspect X', year:'2005', score:'GR 4.1', signal:'数学会怎么爱人', tags:'东野圭吾 对弈 东京', summary:'一位数学老师为邻居设计了近乎无缝的保护方案，而物理学家汤川要找出那道最难察觉的裂口。', link:'https://openlibrary.org/search?q=The+Devotion+of+Suspect+X', art:'static', path:'detective' },
  { id:'tokyozodiac', type:'book', typeZh:'小说', title:'占星术杀人事件', original:'The Tokyo Zodiac Murders', year:'1981', score:'GR 3.9', signal:'一封密室遗书', tags:'密室 本格 日本', summary:'一桩年代久远的密室案件，留下了一封异样的遗书与看似不可能的现场。适合喜欢自己画图推演的人。', link:'https://openlibrary.org/search?q=The+Tokyo+Zodiac+Murders', art:'theatre', path:'detective' },
  { id:'secrethistory', type:'book', typeZh:'小说', title:'秘史', original:'The Secret History', year:'1992', score:'GR 4.2', signal:'古典课之后', tags:'校园 秘密 群像', summary:'一位局外人进入小型古典文学圈子，优雅、崇拜与越界逐渐缠在一起。它从结果开始告诉你一切已来不及。', link:'https://openlibrary.org/search?q=The+Secret+History+Donna+Tartt', art:'theatre', path:'mind' },
  { id:'ripley', type:'book', typeZh:'小说', title:'天才雷普利', original:'The Talented Mr. Ripley', year:'1955', score:'GR 3.9', signal:'借一个人的生活', tags:'身份 海岸 欲望', summary:'一位年轻人受托去带回富家子弟，却发现某种生活比原来的自己更值得拥有。', link:'https://openlibrary.org/search?q=The+Talented+Mr+Ripley', art:'theatre', path:'mind' },
  { id:'nameofrose', type:'book', typeZh:'小说', title:'玫瑰的名字', original:'The Name of the Rose', year:'1980', score:'GR 4.1', signal:'图书馆不见光', tags:'修道院 书籍 中世纪', summary:'修道院内连续发生事件，修士在一座像迷宫般的图书馆里寻找因果。它也是一场关于阅读的谜题。', link:'https://openlibrary.org/search?q=The+Name+of+the+Rose', art:'corridor', path:'sealed' },
  { id:'shiningbook', type:'book', typeZh:'小说', title:'闪灵', original:'The Shining · Stephen King', year:'1977', score:'GR 4.3', signal:'217号房', tags:'酒店 冬天 家庭', summary:'电影之外的原始版本更靠近一个家庭逐渐失衡的过程。老酒店的历史像一个不断被翻开的暗格。', link:'https://openlibrary.org/search?q=The+Shining+Stephen+King', art:'corridor', path:'sealed' },
  { id:'hauntingbook', type:'book', typeZh:'小说', title:'山屋', original:'The Haunting of Hill House', year:'1959', score:'GR 3.8', signal:'屋子本就不正', tags:'古宅 心理 雕刻', summary:'四个人来到一栋据说不欢迎住客的房子。杰克逊只用极少的笔触，就让地板与墙壁开始不可信。', link:'https://openlibrary.org/search?q=The+Haunting+of+Hill+House', art:'corridor', path:'sealed' },
  { id:'womanwhite', type:'book', typeZh:'小说', title:'白衣女人', original:'The Woman in White', year:'1859', score:'GR 3.9', signal:'夜路上的白影', tags:'哥特 身份 遗产', summary:'一名画师在夜里遇到神秘女子，随后受聘进入庄园。威尔基·柯林斯的长篇布局适合慢慢陷进去。', link:'https://openlibrary.org/search?q=The+Woman+in+White+Wilkie+Collins', art:'theatre', path:'detective' }
];

records.push(
  { id:'exorcistfilm', type:'film', typeZh:'电影', title:'驱魔人', original:'The Exorcist', year:'1973', score:'IMDb 8.1', signal:'电话没有挂断', tags:'旧宅 信仰 午夜', summary:'一位母亲为女儿寻找答案，而所有看似可靠的解释都逐一失效。它的力量在于始终把不可能放在日常客厅里。', art:'static', path:'sealed' },
  { id:'rosemary', type:'film', typeZh:'电影', title:'罗斯玛丽的婴儿', original:"Rosemary's Baby", year:'1968', score:'IMDb 8.0', signal:'邻居太热情', tags:'公寓 疑心 都市', summary:'搬进新公寓后，年轻妻子发现每一份善意都像带着另一层安排。罗曼·波兰斯基让门铃声也变得可疑。', art:'corridor', path:'mind' },
  { id:'lighthouse', type:'film', typeZh:'电影', title:'灯塔', original:'The Lighthouse', year:'2019', score:'IMDb 7.4', signal:'灯不准靠近', tags:'海岛 两人 风暴', summary:'两名看守者困在海边礁石上，日子被酒、风浪和一盏不准触碰的灯搅成了结。', art:'static', path:'sealed' },
  { id:'witch', type:'film', typeZh:'电影', title:'女巫', original:'The Witch', year:'2015', score:'IMDb 7.0', signal:'树林在看', tags:'新英格兰 家庭 荒野', summary:'被放逐到森林边缘的一家人，在失去作物与彼此信任后，开始听见树林里的另一种语言。', art:'corridor', path:'town' },
  { id:'hereditary', type:'film', typeZh:'电影', title:'遗传厄运', original:'Hereditary', year:'2018', score:'IMDb 7.3', signal:'阁楼上有声音', tags:'家庭 模型屋 遗产', summary:'葬礼之后，一家人发现有些东西不是被继承在相册里，而是藏在看不见的习惯与房间中。', art:'theatre', path:'sealed' },
  { id:'babadook', type:'film', typeZh:'电影', title:'鬼书', original:'The Babadook', year:'2014', score:'IMDb 6.8', signal:'这本书别打开', tags:'绘本 母子 失眠', summary:'一本没有署名的立体书出现在家里，故事里的东西似乎比孩子更早知道这个家的疲惫。', art:'static', path:'mind' },
  { id:'ringu', type:'film', typeZh:'电影', title:'午夜凶铃', original:'Ring', year:'1998', score:'IMDb 7.2', signal:'七天之后', tags:'录像带 井 电话', summary:'一盘无法解释的录像带，在复制与传递中留下相同的倒计时。它让屏幕本身变成一扇门。', art:'static', path:'town' },

  { id:'outsider', type:'series', typeZh:'剧集', title:'局外人', original:'The Outsider', year:'2020', score:'IMDb 7.6', signal:'证据互相矛盾', tags:'小镇 案件 目击', summary:'所有证据都指向同一个人，却又证明他不可能出现。调查越深入，现实的边界越不稳固。', art:'corridor', path:'detective' },
  { id:'archive81', type:'series', typeZh:'剧集', title:'81号档案', original:'Archive 81', year:'2022', score:'IMDb 7.3', signal:'磁带还在转', tags:'录像 修复 公寓', summary:'受雇修复旧磁带的档案员，逐渐被二十多年前失踪的纪录片作者牵入同一栋公寓。', art:'static', path:'sealed' },
  { id:'yellowjackets', type:'series', typeZh:'剧集', title:'黄蜂', original:'Yellowjackets', year:'2021', score:'IMDb 7.8', signal:'森林记得她们', tags:'坠机 双线 秘密', summary:'幸存者们带着共同保守多年的记忆重新相遇。过去的冬天，并没有停在当年的森林里。', art:'corridor', path:'town' },
  { id:'usher', type:'series', typeZh:'剧集', title:'厄舍府的崩塌', original:'The Fall of the House of Usher', year:'2023', score:'IMDb 7.9', signal:'家族账本', tags:'家族 寓言 倒叙', summary:'医药帝国的继承人接连离场，家族掌舵人终于开始讲述那一夜他签下的条件。', art:'theatre', path:'mind' },
  { id:'cherryflavor', type:'series', typeZh:'剧集', title:'樱桃新滋味', original:'Brand New Cherry Flavor', year:'2021', score:'IMDb 7.2', signal:'愿望有价', tags:'洛杉矶 电影 交易', summary:'一位年轻导演为复仇接受陌生女人的帮助，却发现每一笔报酬都比预想中更具体。', art:'theatre', path:'mind' },

  { id:'shiki', type:'anime', typeZh:'动画', title:'尸鬼', original:'Shiki', year:'2010', score:'IMDb 7.6', signal:'村子在变少', tags:'村庄 夏天 医生', summary:'偏僻山村的夏天闷热漫长，住民陆续病倒。直到死亡变得太频繁，所有人才意识到村庄已经换了一种规则。', art:'corridor', path:'town' },
  { id:'another', type:'anime', typeZh:'动画', title:'替身', original:'Another', year:'2012', score:'IMDb 7.4', signal:'班级多了一个人', tags:'校园 诅咒 名单', summary:'转学生发现班上所有人都刻意忽略一名女生，而这不是他们第一次这样做。', art:'theatre', path:'town' },
  { id:'boogiepop', type:'anime', typeZh:'动画', title:'幻影死神', original:'Boogiepop Phantom', year:'2000', score:'IMDb 7.2', signal:'城市传说醒了', tags:'群像 都市 失踪', summary:'一束光划过城市后，学生们的记忆与传闻开始彼此渗透。叙事碎片要到最后才会拼上。', art:'static', path:'mind' },
  { id:'ghosthound', type:'anime', typeZh:'动画', title:'神灵狩', original:'Ghost Hound', year:'2007', score:'IMDb 7.3', signal:'梦里能出去', tags:'乡镇 灵魂 创伤', summary:'三个少年在梦中离开身体，去到与现实重叠的另一层世界。它把焦虑讲得极其安静。', art:'corridor', path:'mind' },
  { id:'ghosthunt', type:'anime', typeZh:'动画', title:'奇幻贵公子', original:'Ghost Hunt', year:'2006', score:'IMDb 7.4', signal:'录音机有回放', tags:'调查 社团 校园', summary:'高中女生进入灵异调查事务所，各类委托像一份份需要耐心拆解的现场报告。', art:'static', path:'detective' },

  { id:'exorcistbook', type:'book', typeZh:'小说', title:'驱魔人', original:'The Exorcist · William Peter Blatty', year:'1971', score:'GR 4.0', signal:'解释全部失灵', tags:'信仰 母亲 旧宅', summary:'电影原作更像一份逐渐失控的调查报告，在医学、信仰与母亲的恐惧之间反复追问。', art:'static', path:'sealed' },
  { id:'ruins', type:'book', typeZh:'小说', title:'遗迹', original:'The Ruins', year:'2006', score:'GR 3.6', signal:'藤蔓会说话', tags:'旅行 遗址 困境', summary:'几个旅人偏离路线，登上一座没有地图标记的遗址。越想离开，周围的植物越像在听。', art:'corridor', path:'sealed' },
  { id:'fisherman', type:'book', typeZh:'小说', title:'渔夫', original:'The Fisherman', year:'2016', score:'GR 3.8', signal:'别去那片水域', tags:'钓鱼 传说 哀伤', summary:'两位失去伴侣的男人循着旧传闻去钓鱼，沿途遇到的是一段比河流更古老的故事。', art:'corridor', path:'town' },
  { id:'elementals', type:'book', typeZh:'小说', title:'元素人', original:'The Elementals', year:'1981', score:'GR 3.9', signal:'沙子进屋了', tags:'海岸 房屋 家族', summary:'两幢夏屋之间夹着第三幢被沙丘吞没的房子。越靠近它，家族里没人愿意说的往事越清楚。', art:'theatre', path:'sealed' },
  { id:'iamlegend', type:'book', typeZh:'小说', title:'我是传奇', original:'I Am Legend', year:'1954', score:'GR 4.0', signal:'白天属于他', tags:'孤城 日记 孤独', summary:'一个人留在空城中，以日复一日的秩序对抗漫长孤独。它的结尾会重新定义故事的视角。', art:'static', path:'sealed' },

  { id:'uzumaki', type:'manga', typeZh:'漫画', title:'漩涡', original:'Uzumaki', year:'1998', score:'GR 4.2', signal:'一切都在打转', tags:'小镇 形状 伊藤润二', summary:'一个普通小镇开始被螺旋形支配。伊藤润二用不断升级的日常异变，让最简单的图案失去安全感。', art:'static', path:'town' },
  { id:'driftingclass', type:'manga', typeZh:'漫画', title:'漂流教室', original:'The Drifting Classroom', year:'1972', score:'GR 4.1', signal:'学校不在原地', tags:'校园 末日 生存', summary:'整所小学连同师生被抛进荒芜世界。它既是求生故事，也是关于成年人秩序突然消失的噩梦。', art:'corridor', path:'sealed' },
  { id:'homunculus', type:'manga', typeZh:'漫画', title:'异变者', original:'Homunculus', year:'2003', score:'GR 4.0', signal:'钻孔之后', tags:'心理 都市 自我', summary:'接受一场非同寻常的手术后，男人开始看见旁人身上无法言说的形状。', art:'static', path:'mind' },
  { id:'ptsdradio', type:'manga', typeZh:'漫画', title:'PTSD Radio', original:'PTSD Radio', year:'2011', score:'GR 3.7', signal:'每一话都像信号', tags:'短篇 电波 都市', summary:'由不完整短篇组成的异常广播，人物与细节在毫无预警时重新出现，像一台接收不良的收音机。', art:'static', path:'mind' },
  { id:'hikaru', type:'manga', typeZh:'漫画', title:'光死去的夏天', original:'The Summer Hikaru Died', year:'2021', score:'GR 4.2', signal:'回来的人不对', tags:'乡镇 友情 夏天', summary:'好友从山里回来后，外表没有改变，但最熟悉他的那个人最先知道里面已经不是同一个存在。', art:'corridor', path:'town' },

  { id:'silenthill2', type:'game', typeZh:'游戏', title:'寂静岭 2', original:'Silent Hill 2', year:'2001', score:'MC 89', signal:'信中写着等你', tags:'小镇 雾气 寻人', summary:'一封来自已故妻子的信，把詹姆斯带回被雾吞没的小镇。它的谜题和街道都在替他保存记忆。', art:'corridor', path:'mind' },
  { id:'alanwake2', type:'game', typeZh:'游戏', title:'心灵杀手 2', original:'Alan Wake 2', year:'2023', score:'MC 89', signal:'故事在改写', tags:'侦探 舞台 手稿', summary:'两位调查者在不同现实中追踪同一段叙事。手稿、现场与表演不再是彼此分开的东西。', art:'theatre', path:'detective' },
  { id:'signalis', type:'game', typeZh:'游戏', title:'信号', original:'Signalis', year:'2022', score:'MC 81', signal:'记住我们的承诺', tags:'太空 复古 记忆', summary:'一名复制人穿过废弃设施寻找同伴。低分辨率画面下，记忆像无线电噪声一样不断返潮。', art:'static', path:'sealed' },
  { id:'detention', type:'game', typeZh:'游戏', title:'返校', original:'Detention', year:'2017', score:'MC 79', signal:'钟声以后别回头', tags:'校园 台湾 历史', summary:'戒严年代的山间学校，在暴雨夜与记忆深处反复折叠。它将时代伤痕放进了每间教室。', art:'corridor', path:'town' },
  { id:'fatalframe', type:'game', typeZh:'游戏', title:'零：红蝶', original:'Fatal Frame II: Crimson Butterfly', year:'2003', score:'MC 78', signal:'相机看见更多', tags:'双子 村庄 相机', summary:'一对双胞胎走进被遗忘的村庄，只能靠镜头面对不该被看见的东西。', art:'theatre', path:'town' }
);

const wikiPages = {
  silence:'The_Silence_of_the_Lambs_(film)', se7en:'Seven_(1995_film)', psycho:'Psycho_(1960_film)', shining:'The_Shining_(film)', thing:'The_Thing_(1982_film)', others:'The_Others_(2001_film)', sixth:'The_Sixth_Sense', cure:'Cure_(1997_film)', wailing:'The_Wailing_(2016_film)', handmaiden:'The_Handmaiden', memories:'Memories_of_Murder', invisible:'The_Invisible_Guest', shutter:'Shutter_Island_(film)', prestige:'The_Prestige_(film)', letin:'Let_the_Right_One_In_(film)', getout:'Get_Out',
  truedetective:'True_Detective', twinpeaks:'Twin_Peaks', dark:'Dark_(TV_series)', hannibal:'Hannibal_(TV_series)', mindhunter:'Mindhunter_(TV_series)', hillhouse:'The_Haunting_of_Hill_House_(TV_series)', blackmirror:'Black_Mirror', riget:'The_Kingdom_(miniseries)', terror:'The_Terror_(TV_series)', beyondevil:'Beyond_Evil', marianne:"The_Devil's_Hour",
  monster:'Monster_(2004_TV_series)', perfectblue:'Perfect_Blue', paranoia:'Paranoia_Agent', erased:'Erased_(TV_series)', deathnote:'Death_Note', higurashi:'Higurashi_When_They_Cry', madeinabyss:'Made_in_Abyss', lain:'Serial_Experiments_Lain', promised:'The_Promised_Neverland',
  houseleaves:'House_of_Leaves', rebecca:'Rebecca_(novel)', andthen:'And_Then_There_Were_None', roger:'The_Murder_of_Roger_Ackroyd', suspectx:'The_Devotion_of_Suspect_X', tokyozodiac:'The_Tokyo_Zodiac_Murders', secrethistory:'The_Secret_History', ripley:'The_Talented_Mr._Ripley', nameofrose:'The_Name_of_the_Rose', shiningbook:'The_Shining_(novel)', hauntingbook:'The_Haunting_of_Hill_House', womanwhite:'The_Woman_in_White',
  exorcistfilm:'The_Exorcist_(film)', rosemary:"Rosemary's_Baby_(film)", lighthouse:'The_Lighthouse_(2019_film)', witch:'The_Witch_(2015_film)', hereditary:'Hereditary_(film)', babadook:'The_Babadook', ringu:'Ring_(film)',
  outsider:'The_Outsider_(miniseries)', archive81:'Archive_81_(TV_series)', yellowjackets:'Yellowjackets_(TV_series)', usher:'The_Fall_of_the_House_of_Usher_(miniseries)', cherryflavor:'Brand_New_Cherry_Flavor',
  shiki:'Shiki_(novel)', another:'Another_(novel)', boogiepop:'Boogiepop_Phantom', ghosthound:'Ghost_Hound', ghosthunt:'Ghost_Hunt',
  exorcistbook:'The_Exorcist_(novel)', ruins:'The_Ruins_(novel)', fisherman:'The_Fisherman_(novel)', elementals:'The_Elementals_(novel)', iamlegend:'I_Am_Legend_(novel)',
  uzumaki:'Uzumaki', driftingclass:'The_Drifting_Classroom', homunculus:'Homunculus_(manga)', ptsdradio:'PTSD_Radio', hikaru:'The_Summer_Hikaru_Died',
  silenthill2:'Silent_Hill_2', alanwake2:'Alan_Wake_2', signalis:'Signalis', detention:'Detention_(video_game)', fatalframe:'Fatal_Frame_II:_Crimson_Butterfly'
};
const directPosters = {
  monster:'https://m.media-amazon.com/images/M/MV5BOWY4NDkyNzktNjViNy00NmMxLTliYmMtZWJkNDM4YzEzNzA4XkEyXkFqcGc%40._V1_.jpg'
};
const editorialNotes = {
  silence:'克拉丽斯第一次走进汉尼拔的牢房，追凶片就有了另一条主线：两个人如何在谈话里试探彼此。朱迪·福斯特和安东尼·霍普金斯的对手戏至今仍很有分量。',
  se7en:'芬奇把城市拍得又湿又闷，两名警探在一套残酷的规则里追赶凶手。它的冷峻不靠突发声响，靠的是调查一步步被逼进死角。',
  psycho:'从一笔挪用的钱开始，故事拐进一间路边旅馆。希区柯克很擅长让观众先看见问题，再看着人物一步步走过去。',
  shining:'库布里克把偏远酒店拍成几何秩序严密的迷宫。杰克·尼科尔森的表演很外放，真正耐看的却是空间如何慢慢压过一家三口。',
  thing:'极地科考站里，任何人都可能已经不是原来的那个人。卡朋特把封闭环境、猜疑和实景特效拧成一部几乎没有喘息的群像片。',
  others:'一栋大宅、两个不能见光的孩子和一群来路不明的帮工。影片用极少的场景维持张力，妮可·基德曼的克制让结尾更有力。',
  sixth:'布鲁斯·威利斯饰演的儿童心理医生试图帮一个男孩理解自己的处境。它不是靠谜底取胜，前半段的耐心铺垫本身就很扎实。',
  cure:'一名刑警调查多起看似无关的案件，线索总会回到同一个失忆男子身上。黑泽清不急着解释，反而把普通场景拍得越来越不对劲。',
  wailing:'韩国山村接连出事，警察、巫师和外来人各有说法。罗泓轸把调查、民俗和家庭焦虑放在一起，信息越多，判断反而越难。',
  handmaiden:'一个小偷受雇接近富家小姐，骗局很快开始反向运作。朴赞郁在三段叙事里不断交换视角，布景和人物关系同样值得细看。',
  memories:'基于真实案件改编，两名地方警察在没有经验和技术支持的条件下办案。奉俊昊把荒唐、挫败和时代背景都留在调查的细节里。',
  invisible:'这部西班牙密室片把重点放在供词如何被不断修订。适合喜欢跟着角色逐条核对时间线、又不想被无关支线打断的人。',
  shutter:'警探登上精神病院所在的孤岛寻找失踪者，岛上每个人都像提前商量过答案。斯科塞斯把类型片拍成一次越来越私人的回望。',
  prestige:'两位魔术师从竞争走到互相毁掉对方。诺兰用舞台把戏的结构来讲故事，信息给得很早，但真正看懂要等到最后一轮回看。',
  letin:'斯德哥尔摩郊区的冬天里，两个被同学排斥的孩子建立了关系。影片很少煽情，雪、空地和沉默都被用得恰到好处。',
  getout:'一次拜访恋人父母的周末行程，从礼貌的尴尬慢慢变成彻底失控。乔丹·皮尔把社会观察写进类型框架，节奏干脆，细节很多。',

  truedetective:'第一季跟着两名警探重看一宗多年未结的案件。马修·麦康纳和伍迪·哈里森的对话、路易斯安那的湿地，以及时间跳跃共同撑起了气氛。',
  twinpeaks:'劳拉·帕尔默的死亡让一座小镇原本稳定的日常裂开。林奇把肥皂剧、侦探剧和梦境混在一起，越往后越有自己的逻辑。',
  dark:'孩子失踪后，四个家族的关系被拉回不同年代。它确实需要记人物，但编剧对因果链的控制很严，适合连续看而不是断断续续补。',
  hannibal:'威尔·格雷厄姆与汉尼拔之间的关系，比案件本身更重要。布莱恩·富勒把每一季都拍得极其讲究，适合接受慢节奏和强烈视觉风格的观众。',
  mindhunter:'两名探员开始录下对重刑犯的长谈，再试着给这些行为建立分类。芬奇把重点放在访谈、办公室争论和制度阻力上，而不是案件重演。',
  hillhouse:'克雷恩一家多年后重新面对童年住过的房子。它把家庭创伤写进五个孩子各自的回忆，人物关系比设定本身更能留住人。',
  blackmirror:'单集独立，讨论对象从记忆记录到评分系统都有。质量会有起伏，但它适合按兴趣挑集看，也适合从早期几集进入这个世界。',
  riget:'拉斯·冯·提尔把一所医院拍成怪人、制度和超自然现象同时失控的地方。粗粝摄影和黑色幽默是它区别于普通医疗剧的关键。',
  terror:'根据富兰克林远征的真实历史改编，两艘船被困在北极冰层里。它对饥饿、疾病和等级关系的描写很具体，环境本身就是最大压力。',
  beyondevil:'一宗旧案让两名性格完全不同的刑警被迫合作。故事的看点不只是谁做了什么，更是小镇里每个人如何对过去保持沉默。',
  marianne:'一位母亲每天在同一时刻醒来，并卷进一宗跨越多年的案件。剧集把时间循环当作结构工具，后面几集的回收做得很完整。',

  monster:'天马医生当年救下一个孩子，后来不得不追着那次选择留下的后果走遍欧洲。74 集很长，但人物支线和道德问题都处理得有耐心。',
  perfectblue:'偶像转型演员后，未麻发现镜头、粉丝和记忆开始互相干扰。今敏剪辑得非常锋利，第一次看时最好不要分心。',
  paranoia:'一名拿着金色球棒的少年出现在都市传闻里，接触过他的人各自背着不同压力。今敏借群像讲焦虑，结构比表面看起来更严密。',
  erased:'藤沼悟意外回到童年，试图阻止一连串会改变很多人的事件。它是很顺的悬念型动画，亲情线和校园线都不只是陪衬。',
  deathnote:'夜神月拿到一本能决定生死的笔记本后，与 L 展开长期对弈。设定直接、推进快，是入门智斗题材时很稳的一部。',
  higurashi:'小镇祭典和连年失踪案反复出现，同一批人物被放进不同结果里。前段故意碎，耐心看完几个篇章后，人物关系会逐渐清楚。',
  madeinabyss:'莉可和雷格进入巨大的深渊寻找母亲。世界设计很漂亮，但它对冒险代价并不手软，适合知道这一点后再开始。',
  lain:'玲音收到一封来自已故同学的邮件，随后逐渐进入网络世界。它保留了九十年代的技术想象，也提前碰到了今天仍在讨论的身份问题。',
  promised:'孤儿院的孩子们发现了大人隐瞒的规则，只能在严密监视下制定逃跑计划。第一季的智力对抗足够完整，可以单独观看。',

  houseleaves:'一部关于房子的手稿，被注释、采访、排版和旁枝故事层层包住。它需要慢读，页码、空白和文字排列本身都是叙事的一部分。',
  rebecca:'年轻妻子进入曼德利庄园后，发现丈夫的前任几乎仍在支配所有人。达芙妮·杜穆里埃写得很利落，第一人称的不安也很可信。',
  andthen:'十名陌生人被邀请到岛上，名单和童谣开始逐一应验。阿加莎把封闭空间推理的节奏做得极简，最好不要提前看任何梗概。',
  roger:'波洛来到一个安静村庄处理富商遇害案。它最出名的地方不在机关复杂，而在读者会如何相信一个讲故事的人。',
  suspectx:'数学教师石神为邻居设计不在场证明，物理学家汤川负责找漏洞。东野圭吾把推理写得清楚，也让人物动机不只是解题条件。',
  tokyozodiac:'一封遗书和一间密室，把几十年前的案件留成了难题。岛田庄司会把线索摆在桌面上，读者可以真的停下来自己推。',
  secrethistory:'理查德进入一群研读古典学的学生中间，很快被他们的审美和规矩吸引。唐娜·塔特从结果开始讲，重点是关系怎样一步步失衡。',
  ripley:'汤姆·雷普利奉命去意大利找回富家子弟，却越来越想占用对方的人生。派翠西亚·海史密斯写得冷静，读者会被迫跟着他看下去。',
  nameofrose:'中世纪修道院接连发生死亡事件，方济各会修士威廉从书、符号和争论中找线索。它既是谜案，也是一部关于知识如何被管理的小说。',
  shiningbook:'电影之外，金的原作更重视杰克戒酒失败和家庭关系的累积。酒店依然重要，但人物走到那一步的过程写得更长也更痛。',
  hauntingbook:'四个人去山屋参加一次研究，内向的埃莉诺渐渐把房子当成唯一接纳自己的地方。杰克逊的句子很轻，心理压力却一直在加。',
  womanwhite:'画师沃尔特在夜路上遇见一名白衣女子，随后进入一座庄园工作。柯林斯擅长多视角叙述和身份谜团，适合喜欢维多利亚时代长篇的人。',

  exorcistfilm:'母亲为女儿寻找医学解释，最后只能向两位神父求助。它的核心是信仰、照护和无力感，直到今天仍比许多模仿者更扎实。',
  rosemary:'罗斯玛丽搬进老公寓后，发现邻居的关心有些越界。波兰斯基始终跟着她的视角走，因此观众很难比她更早知道真相。',
  lighthouse:'两名灯塔看守人在风暴和酒精里互相消耗。黑白画面、窄幅比例和两位演员的表演都很极端，适合喜欢强作者风格的观众。',
  witch:'十七世纪新英格兰，一家人被逐出聚居地后在森林边安家。罗伯特·艾格斯把宗教焦虑和家庭猜疑放在同一张餐桌上。',
  hereditary:'祖母去世后，一家人开始发现自己继承的不只是物品。阿里·艾斯特对家庭冲突写得很细，模型屋和表演让影片的质感很特别。',
  babadook:'单亲母亲和儿子被一本突然出现的绘本困住。它把育儿疲惫、悲伤和童话视觉结合得很紧，适合不只想看类型套路的人。',
  ringu:'记者调查一盘神秘录像带，发现看过的人都会接到同一通电话。中田秀夫把录像机、电话和水井这些日常物件用得极有辨识度。',

  outsider:'小镇教练被完整证据指认为嫌疑人，但他又有无可辩驳的不在场证明。剧集前半段是扎实的侦查，后半段才逐步扩大问题。',
  archive81:'丹把旧录像带数字化，录到的是一位研究生调查公寓失踪案的过程。双线叙事有明确的档案感，适合喜欢磁带、旧楼和都市传说的人。',
  yellowjackets:'一群高中女足球员坠机后在荒野中求生，多年后的幸存者仍在回避那段经历。它最有意思的是成人线和少女线彼此不断修正。',
  usher:'厄舍家族的继承人接连死亡，父亲在一夜之间讲完旧账。迈克·弗拉纳根把爱伦·坡的多个故事拆开重组，节奏比他的长剧更利落。',
  cherryflavor:'一位新人导演来到洛杉矶，想为被夺走的作品讨回代价。它把独立电影圈、巫术交易和八十年代质感搅在一起，走得很偏。',

  shiki:'山村在盛夏接连有人病倒，医生和少年开始意识到这里发生的事并不寻常。人物立场会不断交换，后半段对群体选择的处理很有劲。',
  another:'转学生发现班里有一个大家都假装不存在的人。它的设定非常直接，校园里的规矩越说不清，紧张感反而越稳定。',
  boogiepop:'都市里出现关于死神的传闻，多名学生的视角像拼图一样展开。它并不急着讲明白，适合愿意自己整理时间线的人。',
  ghosthound:'三个少年在梦中离开身体，也不得不面对各自家庭留下的伤。Production I.G. 把乡镇生活、心理创伤和灵异设定放得很平。',
  ghosthunt:'女高中生加入民间调查事务所，跟着团队处理学校、旧宅和寺庙的委托。每个篇章都有自己的调查流程，群像关系也很舒服。',

  exorcistbook:'布拉蒂的原作有不少医学和新闻调查细节，节奏比电影更慢。读它时能看见作者如何一点点耗尽角色原先相信的解释。',
  ruins:'几个游客在墨西哥旅行时跟着陌生人离开景区，最后被困在一处遗址。小说把空间限制得很死，读起来像看一场持续收紧的生存实验。',
  fisherman:'两位失去妻子的男人去北部水域钓鱼，途中听到一段关于小镇和水库的旧事。约翰·兰根写悲伤很有耐心，传说部分也不浮夸。',
  elementals:'两座海边度假屋之间，有一座正被沙丘慢慢吞掉的空房。麦克道尔把南方家族、夏日炎热和旧宅写得非常有生活感。',
  iamlegend:'内维尔独自住在空城里，白天出门补给，夜晚把门钉紧。马西森最聪明的地方是没有把主角的位置当成理所当然。',

  uzumaki:'黑涡镇的人开始迷恋、恐惧或变成螺旋。伊藤润二把单一图形反复升级，每一章都能独立留下一个很具体的画面。',
  driftingclass:'一整所小学被抛到荒芜未来，留下的孩子得自己建立规则。楳图一雄的画面直接又残酷，读起来比设定听上去更急。',
  homunculus:'无家可归的名越接受头部手术后，开始以异常形态看见别人。山本英夫把社会身份和身体感受画得很不舒服，也很明确。',
  ptsdradio:'大量极短篇围绕头发、房屋和一段不明录音展开。它不解释，也不急着给结论，更像一本被人随手塞进抽屉的怪笔记。',
  hikaru:'光从山里回来后，最好的朋友最先知道他已经不太像以前。作者把乡间日常和少年关系写得很细，因此变化显得更扎眼。',

  silenthill2:'詹姆斯收到亡妻来信，前往雾中的寂静岭。它用场景、怪物和多重结局围绕愧疚展开，至今仍是心理叙事游戏的标杆。',
  alanwake2:'萨贾调查连环案件，艾伦试图从自己写下的故事里脱身。两条线交替推进，游戏愿意把音乐、实拍和关卡设计全部当作叙事的一部分。',
  signalis:'复制人艾尔斯特在废弃设施中寻找同伴。低多边形画面和旧式科幻美术很有辨识度，文本不多，但记忆与承诺的线索很清楚。',
  detention:'戒严时期的台湾校园里，两名学生在暴雨夜醒来。赤烛把历史记忆、民间信仰和校园空间连在一起，篇幅不长，完成度很高。',
  fatalframe:'双胞胎姐妹误入一座举行仪式的村庄，只能用相机面对来袭者。固定镜头和取景框的设计很简单，却让每一步都格外谨慎。'
};
records.forEach(record => {
  record.wiki = wikiPages[record.id] || record.original;
  record.platform = ['anime', 'manga', 'game'].includes(record.type) ? 'Bangumi' : '豆瓣';
  record.coverSearch = ({ monster:'Monster 2004', ghosthunt:'Ghost Hunt', ptsdradio:'PTSD Radio', elementals:'The Elementals Michael McDowell' })[record.id] || record.original;
  record.poster = directPosters[record.id] || '';
  record.summary = editorialNotes[record.id] || record.summary;
});


window.NIGHT_INDEX_RECORDS = records;
})();
