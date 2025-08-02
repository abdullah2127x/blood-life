"use client";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Building,
  Users,
  Clock,
  Award,
  CheckCircle,
  Laptop,
  Quote,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      {/* Hero Section */}
      <PageHero
        title="About Us"
        description="We provide life-saving blood services through our hospital blood bank and digital platform, connecting donors with those in need to make a meaningful impact."
      />

      {/* Introduction Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-secondaryColor mb-8 animate-fade-in">
            Blood Life Hospital Blood Bank is a state-of-the-art facility
            combining traditional blood banking services with modern digital
            solutions. We operate both a physical blood bank at our hospital and
            an online platform to connect donors with those in need.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-normalRed/10 to-normalBlue/10 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Our Mission",
              icon: (
                <Heart className="w-12 h-12 text-normalRed mb-4 animate-bounce" />
              ),
              description: `To provide safe, reliable blood services through our hospital blood bank while leveraging technology to create a broader network of donors and recipients, ensuring blood availability for all patients in need.`,
            },
            {
              title: "Our Vision",
              icon: (
                <Award className="w-12 h-12 text-normalRed mb-4 animate-bounce" />
              ),
              description: ` To be the region's leading blood center, combining medical excellence with technological innovation to serve our community's blood needs efficiently and effectively.`,
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="transition-transform hover:scale-105 shadow-xl animate-fade-in-up"
            >
              <CardHeader>
                {item.icon}
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondaryColor">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Services Section */}
      <div className="bg-gradient-to-r from-normalBlue/10 to-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hospital Services */}
            <Card className="shadow-lg animate-fade-in-up">
              <CardHeader>
                <Building className="w-12 h-12 text-normalRed mb-4" />
                <CardTitle>Hospital Blood Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>State-of-the-art blood storage facilities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Advanced blood testing laboratory</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Component separation unit</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>On-site donation facility</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Emergency blood supply services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Online Platform */}
            <Card className="shadow-lg animate-fade-in-up">
              <CardHeader>
                <Laptop className="w-12 h-12 text-normalRed mb-4" />
                <CardTitle>Digital Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Online donor registration</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Blood availability search</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Emergency blood requests</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Donor-recipient matching</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-normalRed mt-1" />
                    <span>Real-time inventory updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonial/Impact Section */}
      <div className="bg-gradient-to-r from-white to-normalRed/10 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            Donor & Recipient Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg animate-fade-in-up">
              <CardHeader className="flex flex-row items-center gap-4">
                <Quote className="w-8 h-8 text-normalBlue" />
                <div>
                  <p className="font-semibold text-lg text-darkRed">
                    Ayesha, Donor
                  </p>
                  <p className="text-xs text-gray-500">Donated 5+ times</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-secondaryColor">
                  Donating blood through this platform was so easy and
                  rewarding. I know my donation helped save lives in my own
                  community.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg animate-fade-in-up">
              <CardHeader className="flex flex-row items-center gap-4">
                <Quote className="w-8 h-8 text-normalBlue" />
                <div>
                  <p className="font-semibold text-lg text-darkRed">
                    Imran, Recipient
                  </p>
                  <p className="text-xs text-gray-500">Received O+ blood</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-secondaryColor">
                  I found a matching donor within hours when my family needed
                  blood urgently. The team was supportive and the process was
                  smooth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
          <div className="animate-pulse">
            <p className="text-4xl font-bold text-normalRed">30+</p>
            <p className="text-secondaryColor">Years Experience</p>
          </div>
          <div className="animate-pulse">
            <p className="text-4xl font-bold text-normalRed">50K+</p>
            <p className="text-secondaryColor">Units Collected</p>
          </div>
          <div className="animate-pulse">
            <p className="text-4xl font-bold text-normalRed">100+</p>
            <p className="text-secondaryColor">Medical Staff</p>
          </div>
          <div className="animate-pulse">
            <p className="text-4xl font-bold text-normalRed">24/7</p>
            <p className="text-secondaryColor">Emergency Service</p>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="bg-gradient-to-r from-normalRed/10 to-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in-up">
              <Building className="w-12 h-12 text-normalRed mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Modern Blood Bank</h3>
              <p className="text-secondaryColor">
                State-of-the-art facilities for blood collection, testing, and
                storage
              </p>
            </div>
            <div className="text-center animate-fade-in-up">
              <Users className="w-12 h-12 text-normalRed mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Expert Team</h3>
              <p className="text-secondaryColor">
                Qualified medical professionals and technical staff
              </p>
            </div>
            <div className="text-center animate-fade-in-up">
              <Clock className="w-12 h-12 text-normalRed mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">24/7 Services</h3>
              <p className="text-secondaryColor">
                Round-the-clock emergency blood services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <PageHero
        title=" Need Blood or Want to Donate?"
        description=" Visit our hospital blood bank or use our online platform to register as a donor or request blood. We're here to help 24/7."
      >
        <div className="flex justify-center gap-4 mt-4">
          <Button
            asChild
            className="bg-white border border-darkRed text-darkRed hover:bg-darkRed hover:border-white hover:text-white shadow-lg animate-bounce"
          >
            <Link href="/register">Become a Donor</Link>
          </Button>
          <Button
            asChild
            className="bg-normalRed hover:bg-darkRed text-white shadow-lg animate-bounce"
          >
            <Link href="/request">Request Blood</Link>
          </Button>
        </div>
      </PageHero>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
