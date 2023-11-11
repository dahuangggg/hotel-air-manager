import React from "react";
import Carousel from "../components/Carousel/Carousel";
import NavigationBar from "../components/NavigationBar/NavigationBar";

// const customTheme = createTheme({
//     palette: {
//         primary: {
//             main: "#343541", // 修改按钮主颜色
//         },
//     },
// });

const IndexView: React.FC = () => {
    return (
        <>
            <NavigationBar/>
            <img
                src="/index.jpg" // 更换为你的图片路径
                alt="描述" // 添加适当的alt描述
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover' // 保持宽高比
                }}
            />
            <div id="culture">
                <div style={{height: 64}}/>
                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '60vh'}}>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '20px',
                        textAlign: 'right'
                    }}>
                        <h1 className="fw-bold mb-5">波普特酒店</h1>
                        <h3 className=" mb-4">波普特廉价酒店是一家以提供经济实惠住宿为主打的酒店，位于帝都三环内的大学城附近。</h3>
                        <h3 className=" mb-4"> 由于酒店的舒适住宿环境和相对较低的价格，吸引了广泛的客户群体，</h3>
                        <h3 className=" mb-4">包括附近的学生、学生的亲属、旅行者和商务出差者等。</h3>
                        <h3 className=" mb-4"> 酒店共有100间客房，分布在多层楼上，</h3>
                        <h3 className=" mb-4">每间客房都配备了基本的设施，如床、浴室、电视以及新引入的自助中央温控系统。</h3>

                    </div>
                    <div style={{flex: 1}}>
                        <Carousel/>
                    </div>
                </div>
                <section>
                    <div className="container bg-primary-gradient py-5">
                        <div className="row">
                            <div className="col-md-8 col-xl-6 text-center mx-auto">
                                <p className="fw-bold text-success mb-2">Our Services</p>
                                <h3 className="fw-bold mb-3">What we can do for you</h3>
                            </div>
                        </div>
                        <div className="py-5 p-lg-5">
                            <div className="row row-cols-1 row-cols-md-2 mx-auto">
                                <div className="col mb-5">
                                    <div className="card shadow-sm">
                                        <div className="card-body px-4 py-5 px-md-5">
                                            <div
                                                className="bs-icon-lg d-flex justify-content-center align-items-center mb-3 bs-icon"></div>
                                            <h5 className="fw-bold card-title">顾客 </h5>
                                            <p className="text-muted card-text mb-4">对于顾客...</p>
                                            <button className="btn btn-primary shadow" type="button">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mb-5">
                                    <div className="card shadow-sm">
                                        <div className="card-body px-4 py-5 px-md-5">
                                            <div
                                                className="bs-icon-lg d-flex justify-content-center align-items-center mb-3 bs-icon"></div>
                                            <h5 className="fw-bold card-title">管理 </h5>
                                            <p className="text-muted card-text mb-4">对于管理...</p>
                                            <button className="btn btn-primary shadow" type="button">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mb-4">
                                    <div className="card shadow-sm">
                                        <div className="card-body px-4 py-5 px-md-5">
                                            <div
                                                className="bs-icon-lg d-flex justify-content-center align-items-center mb-3 bs-icon"></div>
                                            <h5 className="fw-bold card-title">前台 </h5>
                                            <p className="text-muted card-text mb-4">对于前台...</p>
                                            <button className="btn btn-primary shadow" type="button">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mb-4">
                                    <div className="card shadow-sm">
                                        <div className="card-body px-4 py-5 px-md-5">
                                            <div
                                                className="bs-icon-lg d-flex justify-content-center align-items-center mb-3 bs-icon"></div>
                                            <h5 className="fw-bold card-title">关于 </h5>
                                            <p className="text-muted card-text mb-4">关于我们...</p>
                                            <button className="btn btn-primary shadow" type="button">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default IndexView;
