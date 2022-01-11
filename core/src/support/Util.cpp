/**
 * Created by G-Canvas Open Source Team.
 * Copyright (c) 2017, Alibaba, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache Licence 2.0.
 * For the full copyright and license information, please view
 * the LICENSE file in the root directory of this source tree.
 */
#include "Util.h"
#include "Log.h"
#include <string.h>

#ifdef ANDROID
#include <linux/time.h>
#include <sys/time.h>
#include <semaphore.h>
#endif

namespace gcanvas
{
// flip the pixels by y axis
void FlipPixel(unsigned char *pixels, int w, int h)
{
    // taken from example here:
    // http://www.codesampler.com/2010/11/02/introduction-to-opengl-es-2-0/
    // Flip and invert the PNG image since OpenGL likes to load everything
    // backwards from what is considered normal!
    int halfTheHeightInPixels = h / 2;
    int heightInPixels = h;

    // Assuming RGBA for 4 components per pixel.
    int numColorComponents = 4;

    // Assuming each color component is an unsigned char.
    int widthInChars = w * numColorComponents;

    unsigned char *top = nullptr;
    unsigned char *bottom = nullptr;
    unsigned char temp = 0;

    for (int h = 0; h < halfTheHeightInPixels; ++h)
    {
        top = pixels + h * widthInChars;
        bottom = pixels + (heightInPixels - h - 1) * widthInChars;

        for (int w = 0; w < widthInChars; ++w)
        {
            // Swap the chars around.
            temp = *top;
            *top = *bottom;
            *bottom = temp;

            ++top;
            ++bottom;
        }
    }
}

#ifdef ANDROID
void timeraddMS(struct timeval *a, uint ms)
{
    a->tv_usec += ms * 1000;
    if(a->tv_usec >= 1000000)
    {
        a->tv_sec += a->tv_usec / 1000000;
        a->tv_usec %= 1000000;
    }
}

void waitUtilTimeout(sem_t *sem,uint ms){
#ifdef DEBUG
    sem_wait(sem);
#else
    int ret;
    struct timeval pre;
    struct timeval out;
    struct timespec outtime;

    gettimeofday(&pre, NULL);
    gettimeofday(&out, NULL);
    timeraddMS(&out, ms);
    outtime.tv_sec = out.tv_sec;
    outtime.tv_nsec = out.tv_usec * 1000;

    while ((ret = sem_timedwait(sem,&outtime)) == -1 && errno == EINTR) {
        // Restart if sem_timedwait() is interrupted by signal from
        // some system call somewhere else
        continue;
    }

    if (ret == -1)
    {
        if (errno == ETIMEDOUT)
        {
            struct timeval now;
            gettimeofday(&now, NULL);
            LOG_E("wait time pre: sec=%d,usec=%d\n",pre.tv_sec,pre.tv_usec);
            LOG_E("wait time out: sec=%d,usec=%d\n",out.tv_sec,out.tv_usec);
            LOG_E("wait time now: sec=%d,usec=%d\n",now.tv_sec,now.tv_usec);
            LOG_E("wait time out, and if sem_post(&mSyncSem) later thus will \
                cause next waitUtilTimeout() return immediately, so maybe \
                need increase GCANVAS_TIMEOUT\n");
        }
        else
        {
            LOG_E("wait time sem_timedwait() wrong params\n");
        }
    }
#endif
}

#endif

}
