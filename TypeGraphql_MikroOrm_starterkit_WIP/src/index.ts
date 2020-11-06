import 'reflect-metadata';
import { Application } from '@core/application';

(async () => {
    const application = new Application();
    await application.bootstrap();
    await application.run();
})().catch((e) => console.error(e));

process.on("uncaughtException", error => {
    console.error(error);
});
process.on("unhandledRejection", error => {
    console.error(error);
});
process.on('multipleResolves', (type, promise: Promise<any>, value: any) => {
    console.warn(type, promise, value);
})
