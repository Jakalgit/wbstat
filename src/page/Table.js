import React, {useEffect, useState} from 'react';
import style_css from "../css/Table.module.css"
import {getItems, getOrders} from "../api/wbapi";

const Table = () => {

    document.title = 'Таблица'

    const [loading, setLoading] = useState(false)

    const [currentLine, setCurrentLine] = useState(null)
    const [list, setList] = useState([])

    const [priceSales, setPriceSales] = useState(0)
    const [allPrice, setAllPrice] = useState(0)

    useEffect(() => {
        //Получение айтемов
        let statList = []
        getItems(0, 200).then(data => {
            data.stocks.map(stock => {
                statList.push({barcode: stock.barcode, name: stock.name, article: stock.article, sent: 0, sales: 0, denial: 0, price: 0, priceSales: 0, allPrice: 0})
            })
            getOrders('2022-06-22T00:00:00Z', new Date().toISOString(), 0, 1000).then(data => {
                let all = 0
                let price = 0
                data.orders.map(order => {
                    if (order.userStatus !== 1 && order.status !== 0) {
                        let object = statList[statList.indexOf(statList.find(el => el.barcode === order.barcode))]
                        object.sent++
                        object.price = order.totalPrice / 100
                        object.allPrice += order.totalPrice / 100
                        all += order.totalPrice / 100

                        if (order.userStatus === 2 || order.userStatus === 0) {
                            object.sales++
                            object.priceSales += order.totalPrice / 100
                            price += order.totalPrice / 100
                        } else if (order.userStatus === 3) {
                            object.denial++
                        }

                        statList[statList.indexOf(statList.find(el => el.barcode === order.barcode))] = object
                    }
                })
                setPriceSales(price)
                setAllPrice(all)
                setList(statList)
                setLoading(false)
            })
        })
    }, [])

    if (loading) {
        return (
            <div/>
        )
    }

    return (
        <div className={style_css.work}>
            <div className="table-block">
                <h1 className={style_css.current_item}>{currentLine !== null ? currentLine.name : 'Выберете позицию'}</h1>
                <div className="line">
                    <div className={style_css.text}>
                        <p className={style_css.param}>Наименование</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Отправлено</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Продано</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Отказ</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Цена</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Сумма прод.</p>
                    </div>
                    <div className={style_css.text}>
                        <p className={style_css.param}>Общая сумма</p>
                    </div>
                </div>
                <div className={style_css.table}>
                    {list.length !== 0 ?
                        <div>
                            {list.map(stat =>
                                <div className={style_css.table_line} onClick={() => {setCurrentLine(stat)}}>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{stat.article}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{stat.sent}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{stat.sales}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{stat.denial}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{Math.round(stat.price) + ' ₽'}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{Math.round(stat.priceSales) + ' ₽'}</p>
                                    </div>
                                    <div className={style_css.text}>
                                        <p className={style_css.table_param}>{Math.round(stat.allPrice) + ' ₽'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <div/>
                    }
                </div>
                <div className={style_css.price_line}>
                    <h1 className={style_css.price}>{`Сумма продажи: ${Math.round(priceSales)} ₽`}</h1>
                    <h1 className={style_css.price}>{`Общая сумма: ${Math.round(allPrice)} ₽`}</h1>
                </div>
            </div>
        </div>
    );
};

export default Table;