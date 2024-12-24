const foodData = [
    {
        title: "宁波汤圆",
        image: "/static/images/food/tangyuan.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>宁波汤圆是江南地区最负盛名的特色小吃之一。外皮以上等糯米粉制成，晶莹剔透，柔韧有弹性。内馅选用猪肉、虾仁、笋丁等精心调制，口感丰富，层次分明。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>糯米粉</li>
                <li>猪肉馅</li>
                <li>虾仁</li>
                <li>笋丁</li>
                <li>香菇</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>老外滩糯米圆店 - 中山东路88号</li>
                <li>月湖汤圆店 - 海曙区药行街12号</li>
                <li>天一阁小吃店 - 天一广场附近</li>
            </ul>`
    },
    {
        title: "宁波年糕",
        image: "/static/images/food/niangao.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>宁波年糕以优质糯米为原料，口感软糯，香甜可口。可以煎制或者煮食，是宁波传统节日必备的美食。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>糯米</li>
                <li>白糖</li>
                <li>红枣</li>
                <li>桂花</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>老外婆年糕店 - 城隍庙商圈</li>
                <li>天一阁小吃街 - 天一广场</li>
                <li>江厦街店 - 海曙区江厦街</li>
            </ul>`
    },
    {
        title: "宁波麻糍",
        image: "/static/images/food/maci.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>宁波麻糍外裹花生碎，内含红豆沙馅，软糯香甜，是传统特色小吃。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>糯米粉</li>
                <li>花生碎</li>
                <li>芝麻</li>
                <li>红豆沙</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>天一阁小吃店 - 天一广场附近</li>
                <li>城隍庙老店 - 城隍庙商圈</li>
                <li>鼓楼步行街店 - 海曙区鼓楼</li>
            </ul>`
    },
    {
        title: "宁波海鲜面",
        image: "/static/images/food/haixianmian.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>宁波海鲜面以新鲜海鲜和特制面条为主料，汤头鲜美，是宁波特色面食。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>面条</li>
                <li>海鲜</li>
                <li>葱花</li>
                <li>海鲜汤底</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>老码头海鲜面馆 - 北仑区</li>
                <li>海鲜一条街 - 江北区</li>
                <li>渔人码头 - 镇海区</li>
            </ul>`
    },
    {
        title: "红膏炝蟹",
        image: "/static/images/food/hgqh.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>红膏炝蟹是宁波传统名菜，以新鲜的母蟹为主料，趁热浇上滚烫的油，使蟹膏凝结成块，保持其原有的鲜美。此菜品以其"红膏似火、蟹肉如玉"的特点闻名。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>大闸蟹</li>
                <li>葱花</li>
                <li>姜丝</li>
                <li>料酒</li>
                <li>香醋</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>老外滩海鲜楼 - 中山东路128号</li>
                <li>红膏阁 - 海曙区药行街45号</li>
                <li>蟹家王府 - 天一广场附近</li>
            </ul>`
    },
    {
        title: "宁波老三鲜",
        image: "/static/images/food/dsx.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>宁波老三鲜是以青鱼、黄鱼和带鱼为主料的传统名菜。三种鱼的烹饪方法各不相同，青鱼用炖，黄鱼用煎，带鱼用烤，各具特色，体现了宁波菜的精湛烹饪技艺。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>青鱼</li>
                <li>黄鱼</li>
                <li>带鱼</li>
                <li>姜葱</li>
                <li>料酒</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>老外滩三鲜馆 - 中山东路96号</li>
                <li>天一阁老字号 - 天一广场东侧</li>
                <li>海鲜第一家 - 江北区洪塘街道</li>
            </ul>`
    },
    {
        title: "冰糖甲鱼",
        image: "/static/images/food/btjy.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>冰糖甲鱼是宁波传统名菜，选用上等活甲鱼，配以冰糖、火腿等料烹制，汤汁清亮，鱼肉鲜美，具有滋补养生的功效。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>甲鱼</li>
                <li>冰糖</li>
                <li>火腿</li>
                <li>姜片</li>
                <li>料酒</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>百年老店甲鱼馆 - 海曙区开明街</li>
                <li>天一补品坊 - 天一广场商圈</li>
                <li>老外滩食府 - 中山东路甲鱼专门店</li>
            </ul>`
    },
    {
        title: "奉化芋艿头",
        image: "/static/images/food/ynt.jpg",
        description: `
            <h3>美食介绍</h3>
            <p>奉化芋艿头是宁波市的传统名特优农产品，以其"个大、皮薄、肉白、质粉、味香"的特点闻名。可以清蒸、炒制或煮汤，是秋冬季节的养生佳品。</p>
            
            <h3>主要食材</h3>
            <ul>
                <li>奉化芋艿</li>
                <li>五花肉</li>
                <li>青菜</li>
                <li>葱姜蒜</li>
            </ul>
            
            <h3>推荐餐厅</h3>
            <ul>
                <li>奉化芋艿头专门店 - 奉化区南门街</li>
                <li>老街芋艿坊 - 奉化区大成路</li>
                <li>溪口芋艿馆 - 溪口镇大街</li>
            </ul>`
    }
];

function showDetails(index) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = foodData[index].title;
    modalImage.src = foodData[index].image;
    modalDescription.innerHTML = foodData[index].description;

    modal.style.display = "block";
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// 当点击详情按钮时
function showFoodDetail(foodId) {
    fetch(`/api/food/${foodId}`)
        .then(response => response.json())
        .then(food => {
            const modal = document.getElementById('foodDetailModal');
            const modalContent = document.querySelector('.modal-content');
            
            // 更新模态框内容
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2>${food.name}</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <img src="${food.image_url}" alt="${food.name}">
                    <p class="description">${food.description}</p>
                    <p class="price">价格: ¥${food.price}</p>
                </div>
            `;

            // 显示模态框
            modal.style.display = 'block';
            
            // 允许模态框内容滚动
            modalContent.style.maxHeight = '80vh';  // 设置最大高度
            modalContent.style.overflowY = 'auto';  // 允许垂直滚动
            
            // 关闭按钮事件
            const closeBtn = modal.querySelector('.close');
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            }

            // 点击模态框外部关闭
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        });
} 