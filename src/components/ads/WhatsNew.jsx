import React from 'react';

const WhatsNew = () => {
    return (
        <div className="bg-white py-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                {/* Text Content */}
                <div className="md:w-1/2">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        What's New for the 2018 HYUNDAI <br />
                        <span className="text-accent">Tuscon Premium?</span>
                    </h2>
                    <div className="space-y-4 text-xs text-gray-600 leading-relaxed text-justify">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec at rhoncus est. Suspendisse ac rhoncus nisl.
                        </p>
                        <p>
                            Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed at vulputate leo. Integer in felis sed leo vestibulum venenatis. In bendisse quis arcu sem. Aenean feugiat eu eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh.
                        </p>
                        <p>
                            Mauris sit amet magna eu ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus blandit eleifend. Sed vulputate dictum sem condimentum ullamcorper. Duis venenatis nisi. Proin vitae facilisis nisl, ac posuere leo. Proin vitae facilisis nisl, ac posuere leo. Mauris
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div className="md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"
                        alt="Interior"
                        className="w-full rounded shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;
