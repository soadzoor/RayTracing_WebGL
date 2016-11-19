#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif
struct Ray {
  vec3 origin;
  vec3 dir;
};
struct Material {
  vec3 amb;
  vec3 dif;
  vec3 spec;
  float pow;
  bool refractive;
  bool reflective;
  vec3 f0;
  float n;
};
struct Light {
  vec3 col;
  vec3 pos;
};
struct Plane {
  vec3 n;
  vec3 q;
};
struct Disc {
  vec3 o;
  float r;
  vec3 n;
};
struct Triangle {
  vec3 A;
  vec3 B;
  vec3 C;
};
struct Stack {
  Ray ray;
  vec3 coeff;
  int depth;
};
in vec3 vsRay;
out lowp vec4 fragColor;
uniform vec3 eye;
uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;
uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;
uniform Light lights[3];
uniform vec4 spheres[110];
uniform vec2 torus;
uniform Triangle triangles[14];
uniform float time;
uniform float skyboxRatio;
uniform Disc ground;
uniform Plane skyboxBack;
uniform Plane skyboxDown;
uniform Plane skyboxFront;
uniform Plane skyboxLeft;
uniform Plane skyboxRight;
uniform Plane skyboxUp;
uniform highp int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform int colorModeInTernary[3];
void main ()
{
  Ray ray_1;
  ray_1.origin = eye;
  ray_1.dir = normalize(vsRay);
  highp int i_2;
  bool continueLoop_3;
  lowp vec3 coeff_4;
  highp int bounceCount_5;
  highp int stackSize_6;
  Stack stack_7[8];
  lowp float v_8;
  lowp float u_9;
  highp int tmpvar_10;
  lowp float tmpvar_11;
  lowp vec3 tmpvar_12;
  lowp vec3 tmpvar_13;
  vec3 tmpvar_14;
  lowp vec3 color_15;
  color_15 = vec3(0.0, 0.0, 0.0);
  stackSize_6 = 0;
  bounceCount_5 = 1;
  coeff_4 = vec3(1.0, 1.0, 1.0);
  continueLoop_3 = bool(1);
  i_2 = 0;
  while (true) {
    if ((i_2 >= 16)) {
      break;
    };
    if (!(continueLoop_3)) {
      break;
    };
    vec3 tmpvar_16;
    vec3 tmpvar_17;
    tmpvar_16 = ray_1.origin;
    tmpvar_17 = ray_1.dir;
    highp int tmpvar_18;
    lowp float tmpvar_19;
    lowp vec3 tmpvar_20;
    lowp vec3 tmpvar_21;
    vec3 tmpvar_22;
    tmpvar_18 = tmpvar_10;
    tmpvar_19 = tmpvar_11;
    tmpvar_20 = tmpvar_12;
    tmpvar_21 = tmpvar_13;
    tmpvar_22 = tmpvar_14;
    bool hit_25;
    lowp float minT_26;
    highp int tmpvar_27;
    lowp float tmpvar_28;
    lowp vec3 tmpvar_29;
    lowp vec3 tmpvar_30;
    vec3 tmpvar_31;
    minT_26 = -1.0;
    hit_25 = bool(0);
    for (highp int i_24 = 0; i_24 < 110; i_24++) {
      vec4 sphere_32;
      sphere_32 = spheres[i_24];
      highp int tmpvar_33;
      lowp float tmpvar_34;
      lowp vec3 tmpvar_35;
      lowp vec3 tmpvar_36;
      vec3 tmpvar_37;
      bool tmpvar_38;
      float t_39;
      float t2_40;
      float t1_41;
      vec3 tmpvar_42;
      tmpvar_42 = (tmpvar_16 - sphere_32.xyz);
      float tmpvar_43;
      tmpvar_43 = (dot (tmpvar_42, tmpvar_17) * 2.0);
      float tmpvar_44;
      tmpvar_44 = dot (tmpvar_17, tmpvar_17);
      float tmpvar_45;
      tmpvar_45 = ((tmpvar_43 * tmpvar_43) - ((4.0 * tmpvar_44) * (
        dot (tmpvar_42, tmpvar_42)
       - 
        (sphere_32.w * sphere_32.w)
      )));
      if ((tmpvar_45 < 0.0)) {
        tmpvar_38 = bool(0);
      } else {
        float tmpvar_46;
        tmpvar_46 = sqrt(tmpvar_45);
        float tmpvar_47;
        tmpvar_47 = (((
          -(tmpvar_43)
         + tmpvar_46) / 2.0) / tmpvar_44);
        t1_41 = tmpvar_47;
        float tmpvar_48;
        tmpvar_48 = (((
          -(tmpvar_43)
         - tmpvar_46) / 2.0) / tmpvar_44);
        t2_40 = tmpvar_48;
        if ((tmpvar_47 < 0.001)) {
          t1_41 = -0.001;
        };
        if ((tmpvar_48 < 0.001)) {
          t2_40 = -0.001;
        };
        if ((t1_41 < 0.0)) {
          tmpvar_38 = bool(0);
        } else {
          if ((t2_40 > 0.0)) {
            t_39 = t2_40;
          } else {
            t_39 = t1_41;
          };
          tmpvar_33 = i_24;
          tmpvar_34 = t_39;
          tmpvar_37 = sphere_32.xyz;
          tmpvar_35 = (tmpvar_16 + (t_39 * tmpvar_17));
          tmpvar_36 = normalize((tmpvar_35 - sphere_32.xyz));
          tmpvar_38 = bool(1);
        };
      };
      tmpvar_27 = tmpvar_33;
      tmpvar_28 = tmpvar_34;
      tmpvar_29 = tmpvar_35;
      tmpvar_30 = tmpvar_36;
      tmpvar_31 = tmpvar_37;
      if (tmpvar_38) {
        if (((tmpvar_34 < minT_26) || (minT_26 < 0.0))) {
          minT_26 = tmpvar_34;
          tmpvar_18 = tmpvar_33;
          tmpvar_19 = tmpvar_34;
          tmpvar_20 = tmpvar_35;
          tmpvar_21 = tmpvar_36;
          tmpvar_22 = tmpvar_37;
        };
        hit_25 = bool(1);
      };
    };
    for (highp int i_23 = 110; i_23 < 124; i_23++) {
      Triangle t_49;
      t_49 = triangles[(i_23 - 110)];
      highp int tmpvar_50;
      lowp float tmpvar_51;
      lowp vec3 tmpvar_52;
      lowp vec3 tmpvar_53;
      vec3 tmpvar_54;
      bool tmpvar_55;
      float t1_56;
      float v_57;
      float u_58;
      float invDet_59;
      vec3 T_60;
      vec3 e2_61;
      vec3 e1_62;
      e1_62 = (t_49.B - t_49.A);
      e2_61 = (t_49.C - t_49.A);
      vec3 tmpvar_63;
      tmpvar_63 = ((tmpvar_17.yzx * e2_61.zxy) - (tmpvar_17.zxy * e2_61.yzx));
      invDet_59 = (1.0/(dot (e1_62, tmpvar_63)));
      T_60 = (tmpvar_16 - t_49.A);
      u_58 = (dot (T_60, tmpvar_63) * invDet_59);
      if (((u_58 < 0.0) || (u_58 > 1.0))) {
        tmpvar_55 = bool(0);
      } else {
        vec3 tmpvar_64;
        tmpvar_64 = ((T_60.yzx * e1_62.zxy) - (T_60.zxy * e1_62.yzx));
        v_57 = (dot (tmpvar_17, tmpvar_64) * invDet_59);
        if (((v_57 < 0.0) || ((u_58 + v_57) > 1.0))) {
          tmpvar_55 = bool(0);
        } else {
          t1_56 = (dot (e2_61, tmpvar_64) * invDet_59);
          if ((t1_56 > 0.001)) {
            tmpvar_51 = t1_56;
            tmpvar_50 = i_23;
            tmpvar_52 = (tmpvar_16 + (tmpvar_17 * t1_56));
            vec3 a_65;
            a_65 = (t_49.B - t_49.A);
            vec3 b_66;
            b_66 = (t_49.C - t_49.A);
            tmpvar_53 = normalize(((a_65.yzx * b_66.zxy) - (a_65.zxy * b_66.yzx)));
            tmpvar_54 = (((t_49.A + t_49.B) + t_49.C) / 3.0);
            tmpvar_55 = bool(1);
          } else {
            tmpvar_55 = bool(0);
          };
        };
      };
      tmpvar_27 = tmpvar_50;
      tmpvar_28 = tmpvar_51;
      tmpvar_29 = tmpvar_52;
      tmpvar_30 = tmpvar_53;
      tmpvar_31 = tmpvar_54;
      if (tmpvar_55) {
        if (((tmpvar_51 < minT_26) || (minT_26 < 0.0))) {
          minT_26 = tmpvar_51;
          tmpvar_18 = tmpvar_50;
          tmpvar_19 = tmpvar_51;
          tmpvar_20 = tmpvar_52;
          tmpvar_21 = tmpvar_53;
          tmpvar_22 = tmpvar_54;
        };
        hit_25 = bool(1);
      };
    };
    vec3 tmpvar_67;
    float tmpvar_68;
    lowp vec3 tmpvar_69;
    tmpvar_67 = ground.o;
    tmpvar_68 = ground.r;
    tmpvar_69 = ground.n;
    bool tmpvar_70;
    tmpvar_70 = bool(1);
    bool tmpvar_71;
    lowp float tmpvar_72;
    lowp vec3 tmpvar_73;
    lowp vec3 tmpvar_74;
    vec3 tmpvar_75;
    bool tmpvar_76;
    lowp float tmpvar_77;
    tmpvar_77 = (dot (tmpvar_69, (tmpvar_67 - tmpvar_16)) / dot (tmpvar_69, tmpvar_17));
    if ((tmpvar_77 < 0.001)) {
      tmpvar_76 = bool(0);
    } else {
      tmpvar_72 = tmpvar_77;
      tmpvar_75 = tmpvar_67;
      tmpvar_73 = (tmpvar_16 + (tmpvar_77 * tmpvar_17));
      tmpvar_74 = tmpvar_69;
      tmpvar_76 = bool(1);
    };
    if (tmpvar_76) {
      lowp float tmpvar_78;
      lowp vec3 tmpvar_79;
      tmpvar_79 = ((tmpvar_16 + (tmpvar_72 * tmpvar_17)) - tmpvar_67);
      tmpvar_78 = sqrt(dot (tmpvar_79, tmpvar_79));
      if ((tmpvar_78 <= tmpvar_68)) {
        tmpvar_71 = bool(1);
        tmpvar_70 = bool(0);
      };
    };
    if (tmpvar_70) {
      tmpvar_71 = bool(0);
      tmpvar_70 = bool(0);
    };
    tmpvar_27 = 124;
    tmpvar_28 = tmpvar_72;
    tmpvar_29 = tmpvar_73;
    tmpvar_30 = tmpvar_74;
    tmpvar_31 = tmpvar_75;
    if (tmpvar_71) {
      if (((tmpvar_72 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_72;
        tmpvar_18 = 124;
        tmpvar_19 = tmpvar_72;
        tmpvar_20 = tmpvar_73;
        tmpvar_21 = tmpvar_74;
        tmpvar_22 = tmpvar_75;
      };
      hit_25 = bool(1);
    };
    bool tmpvar_80;
    if ((bounceCount_5 > 1)) {
      vec3 tmpvar_81;
      tmpvar_81.yz = tmpvar_16.yz;
      lowp float tmpvar_82;
      lowp vec3 tmpvar_83;
      lowp vec3 tmpvar_84;
      vec3 tmpvar_85;
      bool tmpvar_86;
      tmpvar_86 = bool(1);
      bool tmpvar_87;
      float result_88;
      float d2_89;
      float d1_90;
      float z_91;
      float h_92;
      float r_93;
      float p_94;
      tmpvar_81.x = (tmpvar_16.x - 10.0);
      float tmpvar_95;
      tmpvar_95 = (torus.x * torus.x);
      float tmpvar_96;
      tmpvar_96 = (torus.y * torus.y);
      float tmpvar_97;
      tmpvar_97 = dot (tmpvar_81, tmpvar_17);
      float tmpvar_98;
      tmpvar_98 = (((
        dot (tmpvar_81, tmpvar_81)
       - tmpvar_96) - tmpvar_95) / 2.0);
      float tmpvar_99;
      tmpvar_99 = (((tmpvar_97 * tmpvar_97) + (
        (tmpvar_95 * tmpvar_17.z)
       * tmpvar_17.z)) + tmpvar_98);
      float tmpvar_100;
      tmpvar_100 = ((tmpvar_98 * tmpvar_97) + ((tmpvar_95 * tmpvar_16.z) * tmpvar_17.z));
      float tmpvar_101;
      tmpvar_101 = (((
        (2.0 * tmpvar_97)
       * 
        (tmpvar_97 * tmpvar_97)
      ) - (
        (2.0 * tmpvar_97)
       * tmpvar_99)) + (2.0 * tmpvar_100));
      p_94 = (((
        (-3.0 * tmpvar_97)
       * tmpvar_97) + (2.0 * tmpvar_99)) / 3.0);
      r_93 = (((
        (((-3.0 * tmpvar_97) * ((tmpvar_97 * tmpvar_97) * tmpvar_97)) + ((4.0 * tmpvar_97) * (tmpvar_97 * tmpvar_99)))
       - 
        ((8.0 * tmpvar_97) * tmpvar_100)
      ) + (4.0 * 
        (((tmpvar_98 * tmpvar_98) + ((tmpvar_95 * tmpvar_16.z) * tmpvar_16.z)) - (tmpvar_95 * tmpvar_96))
      )) / 3.0);
      float tmpvar_102;
      tmpvar_102 = ((p_94 * p_94) + r_93);
      float tmpvar_103;
      tmpvar_103 = (((
        (3.0 * r_93)
       * p_94) - (
        (p_94 * p_94)
       * p_94)) - (tmpvar_101 * tmpvar_101));
      float tmpvar_104;
      tmpvar_104 = ((tmpvar_103 * tmpvar_103) - ((tmpvar_102 * tmpvar_102) * tmpvar_102));
      h_92 = tmpvar_104;
      z_91 = 0.0;
      if ((tmpvar_104 < 0.0)) {
        float tmpvar_105;
        tmpvar_105 = sqrt(tmpvar_102);
        float x_106;
        x_106 = (tmpvar_103 / (tmpvar_105 * tmpvar_102));
        z_91 = ((2.0 * tmpvar_105) * cos((
          (1.570796 - (sign(x_106) * (1.570796 - (
            sqrt((1.0 - abs(x_106)))
           * 
            (1.570796 + (abs(x_106) * (-0.2146018 + (
              abs(x_106)
             * 
              (0.08656672 + (abs(x_106) * -0.03102955))
            ))))
          ))))
         / 3.0)));
      } else {
        float tmpvar_107;
        tmpvar_107 = pow ((sqrt(tmpvar_104) + abs(tmpvar_103)), 0.3333333);
        z_91 = (sign(tmpvar_103) * abs((tmpvar_107 + 
          (tmpvar_102 / tmpvar_107)
        )));
      };
      z_91 = (p_94 - z_91);
      float tmpvar_108;
      tmpvar_108 = (z_91 - (3.0 * p_94));
      d1_90 = tmpvar_108;
      float tmpvar_109;
      tmpvar_109 = ((z_91 * z_91) - (3.0 * r_93));
      d2_89 = tmpvar_109;
      float tmpvar_110;
      tmpvar_110 = abs(tmpvar_108);
      if ((tmpvar_110 < 0.001)) {
        if ((tmpvar_109 < 0.0)) {
          tmpvar_87 = bool(0);
          tmpvar_86 = bool(0);
        } else {
          d2_89 = sqrt(tmpvar_109);
        };
      } else {
        if ((tmpvar_108 < 0.0)) {
          tmpvar_87 = bool(0);
          tmpvar_86 = bool(0);
        } else {
          float tmpvar_111;
          tmpvar_111 = sqrt((tmpvar_108 / 2.0));
          d1_90 = tmpvar_111;
          d2_89 = (tmpvar_101 / tmpvar_111);
        };
      };
      if (tmpvar_86) {
        result_88 = 1e+20;
        h_92 = (((d1_90 * d1_90) - z_91) + d2_89);
        if ((h_92 > 0.0)) {
          float tmpvar_112;
          tmpvar_112 = sqrt(h_92);
          h_92 = tmpvar_112;
          float tmpvar_113;
          tmpvar_113 = ((-(d1_90) - tmpvar_112) - tmpvar_97);
          float tmpvar_114;
          tmpvar_114 = ((-(d1_90) + tmpvar_112) - tmpvar_97);
          if ((tmpvar_113 > 0.0)) {
            result_88 = tmpvar_113;
          } else {
            if ((tmpvar_114 > 0.0)) {
              result_88 = tmpvar_114;
            };
          };
        };
        h_92 = (((d1_90 * d1_90) - z_91) - d2_89);
        if ((h_92 > 0.0)) {
          float tmpvar_115;
          tmpvar_115 = sqrt(h_92);
          h_92 = tmpvar_115;
          float tmpvar_116;
          tmpvar_116 = ((d1_90 - tmpvar_115) - tmpvar_97);
          float tmpvar_117;
          tmpvar_117 = ((d1_90 + tmpvar_115) - tmpvar_97);
          if ((tmpvar_116 > 0.0)) {
            result_88 = min (result_88, tmpvar_116);
          } else {
            if ((tmpvar_117 > 0.0)) {
              result_88 = min (result_88, tmpvar_117);
            };
          };
        };
        if (((result_88 > 0.0) && (result_88 < 1000.0))) {
          tmpvar_82 = result_88;
          tmpvar_83 = (tmpvar_81 + (result_88 * tmpvar_17));
          tmpvar_84 = normalize((tmpvar_83 * (
            (dot (tmpvar_83, tmpvar_83) - (torus.y * torus.y))
           - 
            ((torus.x * torus.x) * vec3(1.0, 1.0, -1.0))
          )));
          tmpvar_87 = bool(1);
          tmpvar_86 = bool(0);
        } else {
          tmpvar_87 = bool(0);
          tmpvar_86 = bool(0);
        };
      };
      tmpvar_27 = 125;
      tmpvar_28 = tmpvar_82;
      tmpvar_29 = tmpvar_83;
      tmpvar_30 = tmpvar_84;
      tmpvar_31 = tmpvar_85;
      tmpvar_80 = tmpvar_87;
    } else {
      tmpvar_80 = bool(0);
    };
    if (tmpvar_80) {
      if (((tmpvar_28 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_28;
        tmpvar_18 = tmpvar_27;
        tmpvar_19 = tmpvar_28;
        tmpvar_20 = tmpvar_29;
        tmpvar_21 = tmpvar_30;
        tmpvar_22 = tmpvar_31;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_118;
    vec3 tmpvar_119;
    tmpvar_118 = skyboxBack.n;
    tmpvar_119 = skyboxBack.q;
    lowp float tmpvar_120;
    lowp vec3 tmpvar_121;
    lowp vec3 tmpvar_122;
    vec3 tmpvar_123;
    bool tmpvar_124;
    lowp float tmpvar_125;
    tmpvar_125 = (dot (tmpvar_118, (tmpvar_119 - tmpvar_16)) / dot (tmpvar_118, tmpvar_17));
    if ((tmpvar_125 < 0.001)) {
      tmpvar_124 = bool(0);
    } else {
      tmpvar_120 = tmpvar_125;
      tmpvar_123 = tmpvar_119;
      tmpvar_121 = (tmpvar_16 + (tmpvar_125 * tmpvar_17));
      tmpvar_122 = tmpvar_118;
      tmpvar_124 = bool(1);
    };
    tmpvar_27 = 126;
    tmpvar_28 = tmpvar_120;
    tmpvar_29 = tmpvar_121;
    tmpvar_30 = tmpvar_122;
    tmpvar_31 = tmpvar_123;
    if (tmpvar_124) {
      if (((tmpvar_120 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_120;
        tmpvar_18 = 126;
        tmpvar_19 = tmpvar_120;
        tmpvar_20 = tmpvar_121;
        tmpvar_21 = tmpvar_122;
        tmpvar_22 = tmpvar_123;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_126;
    vec3 tmpvar_127;
    tmpvar_126 = skyboxDown.n;
    tmpvar_127 = skyboxDown.q;
    lowp float tmpvar_128;
    lowp vec3 tmpvar_129;
    lowp vec3 tmpvar_130;
    vec3 tmpvar_131;
    bool tmpvar_132;
    lowp float tmpvar_133;
    tmpvar_133 = (dot (tmpvar_126, (tmpvar_127 - tmpvar_16)) / dot (tmpvar_126, tmpvar_17));
    if ((tmpvar_133 < 0.001)) {
      tmpvar_132 = bool(0);
    } else {
      tmpvar_128 = tmpvar_133;
      tmpvar_131 = tmpvar_127;
      tmpvar_129 = (tmpvar_16 + (tmpvar_133 * tmpvar_17));
      tmpvar_130 = tmpvar_126;
      tmpvar_132 = bool(1);
    };
    tmpvar_27 = 127;
    tmpvar_28 = tmpvar_128;
    tmpvar_29 = tmpvar_129;
    tmpvar_30 = tmpvar_130;
    tmpvar_31 = tmpvar_131;
    if (tmpvar_132) {
      if (((tmpvar_128 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_128;
        tmpvar_18 = 127;
        tmpvar_19 = tmpvar_128;
        tmpvar_20 = tmpvar_129;
        tmpvar_21 = tmpvar_130;
        tmpvar_22 = tmpvar_131;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_134;
    vec3 tmpvar_135;
    tmpvar_134 = skyboxFront.n;
    tmpvar_135 = skyboxFront.q;
    lowp float tmpvar_136;
    lowp vec3 tmpvar_137;
    lowp vec3 tmpvar_138;
    vec3 tmpvar_139;
    bool tmpvar_140;
    lowp float tmpvar_141;
    tmpvar_141 = (dot (tmpvar_134, (tmpvar_135 - tmpvar_16)) / dot (tmpvar_134, tmpvar_17));
    if ((tmpvar_141 < 0.001)) {
      tmpvar_140 = bool(0);
    } else {
      tmpvar_136 = tmpvar_141;
      tmpvar_139 = tmpvar_135;
      tmpvar_137 = (tmpvar_16 + (tmpvar_141 * tmpvar_17));
      tmpvar_138 = tmpvar_134;
      tmpvar_140 = bool(1);
    };
    tmpvar_27 = 128;
    tmpvar_28 = tmpvar_136;
    tmpvar_29 = tmpvar_137;
    tmpvar_30 = tmpvar_138;
    tmpvar_31 = tmpvar_139;
    if (tmpvar_140) {
      if (((tmpvar_136 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_136;
        tmpvar_18 = 128;
        tmpvar_19 = tmpvar_136;
        tmpvar_20 = tmpvar_137;
        tmpvar_21 = tmpvar_138;
        tmpvar_22 = tmpvar_139;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_142;
    vec3 tmpvar_143;
    tmpvar_142 = skyboxLeft.n;
    tmpvar_143 = skyboxLeft.q;
    lowp float tmpvar_144;
    lowp vec3 tmpvar_145;
    lowp vec3 tmpvar_146;
    vec3 tmpvar_147;
    bool tmpvar_148;
    lowp float tmpvar_149;
    tmpvar_149 = (dot (tmpvar_142, (tmpvar_143 - tmpvar_16)) / dot (tmpvar_142, tmpvar_17));
    if ((tmpvar_149 < 0.001)) {
      tmpvar_148 = bool(0);
    } else {
      tmpvar_144 = tmpvar_149;
      tmpvar_147 = tmpvar_143;
      tmpvar_145 = (tmpvar_16 + (tmpvar_149 * tmpvar_17));
      tmpvar_146 = tmpvar_142;
      tmpvar_148 = bool(1);
    };
    tmpvar_27 = 129;
    tmpvar_28 = tmpvar_144;
    tmpvar_29 = tmpvar_145;
    tmpvar_30 = tmpvar_146;
    tmpvar_31 = tmpvar_147;
    if (tmpvar_148) {
      if (((tmpvar_144 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_144;
        tmpvar_18 = 129;
        tmpvar_19 = tmpvar_144;
        tmpvar_20 = tmpvar_145;
        tmpvar_21 = tmpvar_146;
        tmpvar_22 = tmpvar_147;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_150;
    vec3 tmpvar_151;
    tmpvar_150 = skyboxRight.n;
    tmpvar_151 = skyboxRight.q;
    lowp float tmpvar_152;
    lowp vec3 tmpvar_153;
    lowp vec3 tmpvar_154;
    vec3 tmpvar_155;
    bool tmpvar_156;
    lowp float tmpvar_157;
    tmpvar_157 = (dot (tmpvar_150, (tmpvar_151 - tmpvar_16)) / dot (tmpvar_150, tmpvar_17));
    if ((tmpvar_157 < 0.001)) {
      tmpvar_156 = bool(0);
    } else {
      tmpvar_152 = tmpvar_157;
      tmpvar_155 = tmpvar_151;
      tmpvar_153 = (tmpvar_16 + (tmpvar_157 * tmpvar_17));
      tmpvar_154 = tmpvar_150;
      tmpvar_156 = bool(1);
    };
    tmpvar_27 = 130;
    tmpvar_28 = tmpvar_152;
    tmpvar_29 = tmpvar_153;
    tmpvar_30 = tmpvar_154;
    tmpvar_31 = tmpvar_155;
    if (tmpvar_156) {
      if (((tmpvar_152 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_152;
        tmpvar_18 = 130;
        tmpvar_19 = tmpvar_152;
        tmpvar_20 = tmpvar_153;
        tmpvar_21 = tmpvar_154;
        tmpvar_22 = tmpvar_155;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_158;
    vec3 tmpvar_159;
    tmpvar_158 = skyboxUp.n;
    tmpvar_159 = skyboxUp.q;
    lowp float tmpvar_160;
    lowp vec3 tmpvar_161;
    lowp vec3 tmpvar_162;
    vec3 tmpvar_163;
    bool tmpvar_164;
    lowp float tmpvar_165;
    tmpvar_165 = (dot (tmpvar_158, (tmpvar_159 - tmpvar_16)) / dot (tmpvar_158, tmpvar_17));
    if ((tmpvar_165 < 0.001)) {
      tmpvar_164 = bool(0);
    } else {
      tmpvar_160 = tmpvar_165;
      tmpvar_163 = tmpvar_159;
      tmpvar_161 = (tmpvar_16 + (tmpvar_165 * tmpvar_17));
      tmpvar_162 = tmpvar_158;
      tmpvar_164 = bool(1);
    };
    tmpvar_27 = 131;
    tmpvar_28 = tmpvar_160;
    tmpvar_29 = tmpvar_161;
    tmpvar_30 = tmpvar_162;
    tmpvar_31 = tmpvar_163;
    if (tmpvar_164) {
      if (((tmpvar_160 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_160;
        tmpvar_18 = 131;
        tmpvar_19 = tmpvar_160;
        tmpvar_20 = tmpvar_161;
        tmpvar_21 = tmpvar_162;
        tmpvar_22 = tmpvar_163;
      };
      hit_25 = bool(1);
    };
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    tmpvar_14 = tmpvar_22;
    if (hit_25) {
      lowp float vec_y_166;
      vec_y_166 = -(tmpvar_21.z);
      lowp float vec_x_167;
      vec_x_167 = -(tmpvar_21.x);
      lowp float tmpvar_168;
      lowp float tmpvar_169;
      tmpvar_169 = (min (abs(
        (vec_y_166 / vec_x_167)
      ), 1.0) / max (abs(
        (vec_y_166 / vec_x_167)
      ), 1.0));
      lowp float tmpvar_170;
      tmpvar_170 = (tmpvar_169 * tmpvar_169);
      tmpvar_170 = (((
        ((((
          ((((-0.01213232 * tmpvar_170) + 0.05368138) * tmpvar_170) - 0.1173503)
         * tmpvar_170) + 0.1938925) * tmpvar_170) - 0.3326756)
       * tmpvar_170) + 0.9999793) * tmpvar_169);
      tmpvar_170 = (tmpvar_170 + (float(
        (abs((vec_y_166 / vec_x_167)) > 1.0)
      ) * (
        (tmpvar_170 * -2.0)
       + 1.570796)));
      tmpvar_168 = (tmpvar_170 * sign((vec_y_166 / vec_x_167)));
      if ((abs(vec_x_167) > (1e-08 * abs(vec_y_166)))) {
        if ((vec_x_167 < 0.0)) {
          if ((vec_y_166 >= 0.0)) {
            tmpvar_168 += 3.141593;
          } else {
            tmpvar_168 = (tmpvar_168 - 3.141593);
          };
        };
      } else {
        tmpvar_168 = (sign(vec_y_166) * 1.570796);
      };
      u_9 = (0.5 - (tmpvar_168 / 6.283185));
      lowp float x_171;
      x_171 = -(tmpvar_21.y);
      v_8 = (0.5 + ((
        sign(x_171)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_171)
        )) * (1.570796 + (
          abs(x_171)
         * 
          (-0.2146018 + (abs(x_171) * (0.08656672 + (
            abs(x_171)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_18 == 3)) {
          lowp vec3 normalFromMap_172;
          u_9 = (u_9 + (time / 2.0));
          lowp vec2 tmpvar_173;
          tmpvar_173.x = u_9;
          tmpvar_173.y = v_8;
          normalFromMap_172 = normalize(((2.0 * texture (earthNormalMap, tmpvar_173).xyz) - 1.0));
          lowp mat3 tmpvar_174;
          lowp float tmpvar_175;
          tmpvar_175 = (1.570796 - (sign(tmpvar_21.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_21.z))) * (1.570796 + (abs(tmpvar_21.z) * (-0.2146018 + 
              (abs(tmpvar_21.z) * (0.08656672 + (abs(tmpvar_21.z) * -0.03102955)))
            ))))
          )));
          lowp vec3 tmpvar_176;
          tmpvar_176 = ((tmpvar_21.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_21.zxy * vec3(0.0, 1.0, 0.0)));
          lowp float tmpvar_177;
          tmpvar_177 = sqrt(dot (tmpvar_176, tmpvar_176));
          if ((tmpvar_177 < 0.001)) {
            tmpvar_174 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            lowp vec3 tmpvar_178;
            tmpvar_178 = normalize(tmpvar_176);
            lowp float tmpvar_179;
            tmpvar_179 = sin(tmpvar_175);
            lowp float tmpvar_180;
            tmpvar_180 = cos(tmpvar_175);
            lowp float tmpvar_181;
            tmpvar_181 = (1.0 - tmpvar_180);
            lowp mat3 tmpvar_182;
            tmpvar_182[uint(0)].x = (((tmpvar_181 * tmpvar_178.x) * tmpvar_178.x) + tmpvar_180);
            tmpvar_182[uint(0)].y = (((tmpvar_181 * tmpvar_178.x) * tmpvar_178.y) - (tmpvar_178.z * tmpvar_179));
            tmpvar_182[uint(0)].z = (((tmpvar_181 * tmpvar_178.z) * tmpvar_178.x) + (tmpvar_178.y * tmpvar_179));
            tmpvar_182[1u].x = (((tmpvar_181 * tmpvar_178.x) * tmpvar_178.y) + (tmpvar_178.z * tmpvar_179));
            tmpvar_182[1u].y = (((tmpvar_181 * tmpvar_178.y) * tmpvar_178.y) + tmpvar_180);
            tmpvar_182[1u].z = (((tmpvar_181 * tmpvar_178.y) * tmpvar_178.z) - (tmpvar_178.x * tmpvar_179));
            tmpvar_182[2u].x = (((tmpvar_181 * tmpvar_178.z) * tmpvar_178.x) - (tmpvar_178.y * tmpvar_179));
            tmpvar_182[2u].y = (((tmpvar_181 * tmpvar_178.y) * tmpvar_178.z) + (tmpvar_178.x * tmpvar_179));
            tmpvar_182[2u].z = (((tmpvar_181 * tmpvar_178.z) * tmpvar_178.z) + tmpvar_180);
            tmpvar_174 = tmpvar_182;
          };
          tmpvar_13 = (tmpvar_174 * normalFromMap_172);
        } else {
          if ((tmpvar_18 == 4)) {
            lowp vec3 normalFromMap_183;
            u_9 = (u_9 + (time / 7.0));
            lowp vec2 tmpvar_184;
            tmpvar_184.x = u_9;
            tmpvar_184.y = v_8;
            normalFromMap_183 = normalize(((2.0 * texture (moonNormalMap, tmpvar_184).xyz) - 1.0));
            lowp mat3 tmpvar_185;
            lowp float tmpvar_186;
            tmpvar_186 = (1.570796 - (sign(tmpvar_13.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_13.z))) * (1.570796 + (abs(tmpvar_13.z) * (-0.2146018 + 
                (abs(tmpvar_13.z) * (0.08656672 + (abs(tmpvar_13.z) * -0.03102955)))
              ))))
            )));
            lowp vec3 tmpvar_187;
            tmpvar_187 = ((tmpvar_13.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_13.zxy * vec3(0.0, 1.0, 0.0)));
            lowp float tmpvar_188;
            tmpvar_188 = sqrt(dot (tmpvar_187, tmpvar_187));
            if ((tmpvar_188 < 0.001)) {
              tmpvar_185 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              lowp vec3 tmpvar_189;
              tmpvar_189 = normalize(tmpvar_187);
              lowp float tmpvar_190;
              tmpvar_190 = sin(tmpvar_186);
              lowp float tmpvar_191;
              tmpvar_191 = cos(tmpvar_186);
              lowp float tmpvar_192;
              tmpvar_192 = (1.0 - tmpvar_191);
              lowp mat3 tmpvar_193;
              tmpvar_193[uint(0)].x = (((tmpvar_192 * tmpvar_189.x) * tmpvar_189.x) + tmpvar_191);
              tmpvar_193[uint(0)].y = (((tmpvar_192 * tmpvar_189.x) * tmpvar_189.y) - (tmpvar_189.z * tmpvar_190));
              tmpvar_193[uint(0)].z = (((tmpvar_192 * tmpvar_189.z) * tmpvar_189.x) + (tmpvar_189.y * tmpvar_190));
              tmpvar_193[1u].x = (((tmpvar_192 * tmpvar_189.x) * tmpvar_189.y) + (tmpvar_189.z * tmpvar_190));
              tmpvar_193[1u].y = (((tmpvar_192 * tmpvar_189.y) * tmpvar_189.y) + tmpvar_191);
              tmpvar_193[1u].z = (((tmpvar_192 * tmpvar_189.y) * tmpvar_189.z) - (tmpvar_189.x * tmpvar_190));
              tmpvar_193[2u].x = (((tmpvar_192 * tmpvar_189.z) * tmpvar_189.x) - (tmpvar_189.y * tmpvar_190));
              tmpvar_193[2u].y = (((tmpvar_192 * tmpvar_189.y) * tmpvar_189.z) + (tmpvar_189.x * tmpvar_190));
              tmpvar_193[2u].z = (((tmpvar_192 * tmpvar_189.z) * tmpvar_189.z) + tmpvar_191);
              tmpvar_185 = tmpvar_193;
            };
            tmpvar_13 = (tmpvar_185 * normalFromMap_183);
          };
        };
      };
      bounceCount_5++;
      lowp vec3 tmpvar_194;
      bool tmpvar_195;
      bool tmpvar_196;
      vec3 tmpvar_197;
      float tmpvar_198;
      Material tmpvar_199;
      if ((tmpvar_18 == 0)) {
        tmpvar_199 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_18 == 1)) {
          tmpvar_199 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 2)) {
            tmpvar_199 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 3)) {
              tmpvar_199 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 4)) {
                tmpvar_199 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if (((tmpvar_18 == 5) || (tmpvar_18 == 6))) {
                  tmpvar_199 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 7)) {
                    tmpvar_199 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 8)) {
                      tmpvar_199 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                    } else {
                      if ((tmpvar_18 == 9)) {
                        tmpvar_199 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                      } else {
                        if (((tmpvar_18 >= 10) && (tmpvar_18 < 110))) {
                          tmpvar_199 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                        } else {
                          if (((tmpvar_18 == 110) || (tmpvar_18 == 111))) {
                            tmpvar_199 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 > 111) && (tmpvar_18 < 124))) {
                              tmpvar_199 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                            } else {
                              if ((tmpvar_18 == 124)) {
                                tmpvar_199 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_18 == 125)) {
                                  tmpvar_199 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 125)) {
                                    tmpvar_199 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_199 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      tmpvar_194 = tmpvar_199.amb;
      tmpvar_195 = tmpvar_199.refractive;
      tmpvar_196 = tmpvar_199.reflective;
      tmpvar_197 = tmpvar_199.f0;
      tmpvar_198 = tmpvar_199.n;
      lowp vec3 tmpvar_200;
      if ((tmpvar_18 == 0)) {
        tmpvar_200 = tmpvar_194;
      } else {
        highp int tmpvar_201;
        lowp vec3 tmpvar_202;
        lowp vec3 tmpvar_203;
        tmpvar_201 = tmpvar_18;
        tmpvar_202 = tmpvar_20;
        tmpvar_203 = tmpvar_13;
        highp int j_204;
        lowp vec3 specular_205;
        lowp vec3 diffuse_206;
        lowp vec3 color_207;
        lowp vec3 refDir_208;
        lowp vec3 I_209;
        I_209 = (tmpvar_20 - ray_1.origin);
        refDir_208 = normalize((I_209 - (2.0 * 
          (dot (tmpvar_13, I_209) * tmpvar_13)
        )));
        Material tmpvar_210;
        if ((tmpvar_18 == 0)) {
          tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_210 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_210 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if (((tmpvar_18 == 5) || (tmpvar_18 == 6))) {
                    tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 7)) {
                      tmpvar_210 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 8)) {
                        tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_18 == 9)) {
                          tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_18 >= 10) && (tmpvar_18 < 110))) {
                            tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 == 110) || (tmpvar_18 == 111))) {
                              tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 > 111) && (tmpvar_18 < 124))) {
                                tmpvar_210 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                              } else {
                                if ((tmpvar_18 == 124)) {
                                  tmpvar_210 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 == 125)) {
                                    tmpvar_210 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_18 > 125)) {
                                      tmpvar_210 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      tmpvar_210 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        color_207 = tmpvar_210.amb;
        diffuse_206 = vec3(0.0, 0.0, 0.0);
        specular_205 = vec3(0.0, 0.0, 0.0);
        j_204 = 0;
        while (true) {
          lowp float diffintensity_211;
          if ((j_204 >= 3)) {
            break;
          };
          lowp vec3 tmpvar_212;
          tmpvar_212 = normalize((lights[j_204].pos - tmpvar_202));
          diffintensity_211 = clamp (dot (tmpvar_203, tmpvar_212), 0.0, 1.0);
          vec3 tmpvar_213;
          Material tmpvar_214;
          if ((tmpvar_201 == 0)) {
            tmpvar_214 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_201 == 1)) {
              tmpvar_214 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_201 == 2)) {
                tmpvar_214 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_201 == 3)) {
                  tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_201 == 4)) {
                    tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_201 == 5) || (tmpvar_201 == 6))) {
                      tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_201 == 7)) {
                        tmpvar_214 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_201 == 8)) {
                          tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_201 == 9)) {
                            tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_201 >= 10) && (tmpvar_201 < 110))) {
                              tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_201 == 110) || (tmpvar_201 == 111))) {
                                tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_201 > 111) && (tmpvar_201 < 124))) {
                                  tmpvar_214 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_201 == 124)) {
                                    tmpvar_214 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_201 == 125)) {
                                      tmpvar_214 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_201 > 125)) {
                                        tmpvar_214 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_214 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          tmpvar_213 = tmpvar_214.spec;
          lowp float tmpvar_215;
          tmpvar_215 = clamp (dot (tmpvar_212, refDir_208), 0.0, 1.0);
          Material tmpvar_216;
          if ((tmpvar_201 == 0)) {
            tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_201 == 1)) {
              tmpvar_216 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_201 == 2)) {
                tmpvar_216 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_201 == 3)) {
                  tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_201 == 4)) {
                    tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_201 == 5) || (tmpvar_201 == 6))) {
                      tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_201 == 7)) {
                        tmpvar_216 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_201 == 8)) {
                          tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_201 == 9)) {
                            tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_201 >= 10) && (tmpvar_201 < 110))) {
                              tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_201 == 110) || (tmpvar_201 == 111))) {
                                tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_201 > 111) && (tmpvar_201 < 124))) {
                                  tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_201 == 124)) {
                                    tmpvar_216 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_201 == 125)) {
                                      tmpvar_216 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_201 > 125)) {
                                        tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          specular_205 = clamp (((tmpvar_213 * lights[j_204].col) * pow (tmpvar_215, tmpvar_216.pow)), 0.0, 1.0);
          Material tmpvar_217;
          if ((tmpvar_201 == 0)) {
            tmpvar_217 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_201 == 1)) {
              tmpvar_217 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_201 == 2)) {
                tmpvar_217 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_201 == 3)) {
                  tmpvar_217 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_201 == 4)) {
                    tmpvar_217 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_201 == 5) || (tmpvar_201 == 6))) {
                      tmpvar_217 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_201 == 7)) {
                        tmpvar_217 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_201 == 8)) {
                          tmpvar_217 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_201 == 9)) {
                            tmpvar_217 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_201 >= 10) && (tmpvar_201 < 110))) {
                              tmpvar_217 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_201 == 110) || (tmpvar_201 == 111))) {
                                tmpvar_217 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_201 > 111) && (tmpvar_201 < 124))) {
                                  tmpvar_217 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_201 == 124)) {
                                    tmpvar_217 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_201 == 125)) {
                                      tmpvar_217 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_201 > 125)) {
                                        tmpvar_217 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_217 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          diffuse_206 = clamp (((tmpvar_217.dif * diffintensity_211) * lights[j_204].col), 0.0, 1.0);
          if (isShadowOn) {
            lowp vec3 tmpvar_218;
            lowp vec3 tmpvar_219;
            tmpvar_218 = (tmpvar_202 + (tmpvar_203 * 0.001));
            tmpvar_219 = normalize((lights[j_204].pos - tmpvar_202));
            highp int tmpvar_220;
            tmpvar_220 = tmpvar_201;
            highp int i_221;
            highp int i_222;
            lowp float minT_223;
            minT_223 = -1.0;
            i_222 = 0;
            while (true) {
              if ((i_222 >= 110)) {
                break;
              };
              vec4 sphere_224;
              sphere_224 = spheres[i_222];
              highp int tmpvar_225;
              lowp float tmpvar_226;
              bool tmpvar_227;
              lowp float t_228;
              lowp float t2_229;
              lowp float t1_230;
              lowp vec3 tmpvar_231;
              tmpvar_231 = (tmpvar_218 - sphere_224.xyz);
              lowp float tmpvar_232;
              tmpvar_232 = (dot (tmpvar_231, tmpvar_219) * 2.0);
              lowp float tmpvar_233;
              tmpvar_233 = dot (tmpvar_219, tmpvar_219);
              lowp float tmpvar_234;
              tmpvar_234 = ((tmpvar_232 * tmpvar_232) - ((4.0 * tmpvar_233) * (
                dot (tmpvar_231, tmpvar_231)
               - 
                (sphere_224.w * sphere_224.w)
              )));
              if ((tmpvar_234 < 0.0)) {
                tmpvar_227 = bool(0);
              } else {
                lowp float tmpvar_235;
                tmpvar_235 = sqrt(tmpvar_234);
                lowp float tmpvar_236;
                tmpvar_236 = (((
                  -(tmpvar_232)
                 + tmpvar_235) / 2.0) / tmpvar_233);
                t1_230 = tmpvar_236;
                lowp float tmpvar_237;
                tmpvar_237 = (((
                  -(tmpvar_232)
                 - tmpvar_235) / 2.0) / tmpvar_233);
                t2_229 = tmpvar_237;
                if ((tmpvar_236 < 0.001)) {
                  t1_230 = -0.001;
                };
                if ((tmpvar_237 < 0.001)) {
                  t2_229 = -0.001;
                };
                if ((t1_230 < 0.0)) {
                  tmpvar_227 = bool(0);
                } else {
                  if ((t2_229 > 0.0)) {
                    t_228 = t2_229;
                  } else {
                    t_228 = t1_230;
                  };
                  tmpvar_225 = i_222;
                  tmpvar_226 = t_228;
                  tmpvar_227 = bool(1);
                };
              };
              if ((tmpvar_227 && ((tmpvar_226 < minT_223) || (minT_223 < 0.0)))) {
                minT_223 = tmpvar_226;
                tmpvar_220 = tmpvar_225;
              };
              i_222++;
            };
            i_221 = 110;
            while (true) {
              if ((i_221 >= 124)) {
                break;
              };
              Triangle t_238;
              t_238 = triangles[(i_221 - 110)];
              highp int tmpvar_239;
              lowp float tmpvar_240;
              bool tmpvar_241;
              lowp float t1_242;
              lowp float v_243;
              lowp float u_244;
              lowp float invDet_245;
              lowp vec3 T_246;
              vec3 e2_247;
              vec3 e1_248;
              e1_248 = (t_238.B - t_238.A);
              e2_247 = (t_238.C - t_238.A);
              lowp vec3 tmpvar_249;
              tmpvar_249 = ((tmpvar_219.yzx * e2_247.zxy) - (tmpvar_219.zxy * e2_247.yzx));
              invDet_245 = (1.0/(dot (e1_248, tmpvar_249)));
              T_246 = (tmpvar_218 - t_238.A);
              u_244 = (dot (T_246, tmpvar_249) * invDet_245);
              if (((u_244 < 0.0) || (u_244 > 1.0))) {
                tmpvar_241 = bool(0);
              } else {
                lowp vec3 tmpvar_250;
                tmpvar_250 = ((T_246.yzx * e1_248.zxy) - (T_246.zxy * e1_248.yzx));
                v_243 = (dot (tmpvar_219, tmpvar_250) * invDet_245);
                if (((v_243 < 0.0) || ((u_244 + v_243) > 1.0))) {
                  tmpvar_241 = bool(0);
                } else {
                  t1_242 = (dot (e2_247, tmpvar_250) * invDet_245);
                  if ((t1_242 > 0.001)) {
                    tmpvar_240 = t1_242;
                    tmpvar_239 = i_221;
                    tmpvar_241 = bool(1);
                  } else {
                    tmpvar_241 = bool(0);
                  };
                };
              };
              if ((tmpvar_241 && ((tmpvar_240 < minT_223) || (minT_223 < 0.0)))) {
                minT_223 = tmpvar_240;
                tmpvar_220 = tmpvar_239;
              };
              i_221++;
            };
            vec3 tmpvar_251;
            float tmpvar_252;
            lowp vec3 tmpvar_253;
            tmpvar_251 = ground.o;
            tmpvar_252 = ground.r;
            tmpvar_253 = ground.n;
            bool tmpvar_254;
            tmpvar_254 = bool(1);
            bool tmpvar_255;
            lowp float tmpvar_256;
            bool tmpvar_257;
            lowp float tmpvar_258;
            tmpvar_258 = (dot (tmpvar_253, (tmpvar_251 - tmpvar_218)) / dot (tmpvar_253, tmpvar_219));
            if ((tmpvar_258 < 0.001)) {
              tmpvar_257 = bool(0);
            } else {
              tmpvar_256 = tmpvar_258;
              tmpvar_257 = bool(1);
            };
            if (tmpvar_257) {
              lowp float tmpvar_259;
              lowp vec3 tmpvar_260;
              tmpvar_260 = ((tmpvar_218 + (tmpvar_256 * tmpvar_219)) - tmpvar_251);
              tmpvar_259 = sqrt(dot (tmpvar_260, tmpvar_260));
              if ((tmpvar_259 <= tmpvar_252)) {
                tmpvar_255 = bool(1);
                tmpvar_254 = bool(0);
              };
            };
            if (tmpvar_254) {
              tmpvar_255 = bool(0);
              tmpvar_254 = bool(0);
            };
            if ((tmpvar_255 && ((tmpvar_256 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_256;
              tmpvar_220 = 124;
            };
            lowp vec3 tmpvar_261;
            tmpvar_261 = skyboxBack.n;
            lowp float tmpvar_262;
            bool tmpvar_263;
            lowp float tmpvar_264;
            tmpvar_264 = (dot (tmpvar_261, (skyboxBack.q - tmpvar_218)) / dot (tmpvar_261, tmpvar_219));
            if ((tmpvar_264 < 0.001)) {
              tmpvar_263 = bool(0);
            } else {
              tmpvar_262 = tmpvar_264;
              tmpvar_263 = bool(1);
            };
            if ((tmpvar_263 && ((tmpvar_262 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_262;
              tmpvar_220 = 126;
            };
            lowp vec3 tmpvar_265;
            tmpvar_265 = skyboxDown.n;
            lowp float tmpvar_266;
            bool tmpvar_267;
            lowp float tmpvar_268;
            tmpvar_268 = (dot (tmpvar_265, (skyboxDown.q - tmpvar_218)) / dot (tmpvar_265, tmpvar_219));
            if ((tmpvar_268 < 0.001)) {
              tmpvar_267 = bool(0);
            } else {
              tmpvar_266 = tmpvar_268;
              tmpvar_267 = bool(1);
            };
            if ((tmpvar_267 && ((tmpvar_266 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_266;
              tmpvar_220 = 127;
            };
            lowp vec3 tmpvar_269;
            tmpvar_269 = skyboxFront.n;
            lowp float tmpvar_270;
            bool tmpvar_271;
            lowp float tmpvar_272;
            tmpvar_272 = (dot (tmpvar_269, (skyboxFront.q - tmpvar_218)) / dot (tmpvar_269, tmpvar_219));
            if ((tmpvar_272 < 0.001)) {
              tmpvar_271 = bool(0);
            } else {
              tmpvar_270 = tmpvar_272;
              tmpvar_271 = bool(1);
            };
            if ((tmpvar_271 && ((tmpvar_270 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_270;
              tmpvar_220 = 128;
            };
            lowp vec3 tmpvar_273;
            tmpvar_273 = skyboxLeft.n;
            lowp float tmpvar_274;
            bool tmpvar_275;
            lowp float tmpvar_276;
            tmpvar_276 = (dot (tmpvar_273, (skyboxLeft.q - tmpvar_218)) / dot (tmpvar_273, tmpvar_219));
            if ((tmpvar_276 < 0.001)) {
              tmpvar_275 = bool(0);
            } else {
              tmpvar_274 = tmpvar_276;
              tmpvar_275 = bool(1);
            };
            if ((tmpvar_275 && ((tmpvar_274 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_274;
              tmpvar_220 = 129;
            };
            lowp vec3 tmpvar_277;
            tmpvar_277 = skyboxRight.n;
            lowp float tmpvar_278;
            bool tmpvar_279;
            lowp float tmpvar_280;
            tmpvar_280 = (dot (tmpvar_277, (skyboxRight.q - tmpvar_218)) / dot (tmpvar_277, tmpvar_219));
            if ((tmpvar_280 < 0.001)) {
              tmpvar_279 = bool(0);
            } else {
              tmpvar_278 = tmpvar_280;
              tmpvar_279 = bool(1);
            };
            if ((tmpvar_279 && ((tmpvar_278 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_278;
              tmpvar_220 = 130;
            };
            lowp vec3 tmpvar_281;
            tmpvar_281 = skyboxUp.n;
            lowp float tmpvar_282;
            bool tmpvar_283;
            lowp float tmpvar_284;
            tmpvar_284 = (dot (tmpvar_281, (skyboxUp.q - tmpvar_218)) / dot (tmpvar_281, tmpvar_219));
            if ((tmpvar_284 < 0.001)) {
              tmpvar_283 = bool(0);
            } else {
              tmpvar_282 = tmpvar_284;
              tmpvar_283 = bool(1);
            };
            if ((tmpvar_283 && ((tmpvar_282 < minT_223) || (minT_223 < 0.0)))) {
              minT_223 = tmpvar_282;
              tmpvar_220 = 131;
            };
            if ((((
              (((tmpvar_220 != 0) && (tmpvar_220 != 5)) && (tmpvar_220 != 6))
             && 
              (tmpvar_220 != 124)
            ) && (tmpvar_220 != tmpvar_201)) && (tmpvar_201 <= 124))) {
              specular_205 = vec3(0.0, 0.0, 0.0);
              diffuse_206 = vec3(0.0, 0.0, 0.0);
            };
          };
          color_207 = (color_207 + (diffuse_206 + specular_205));
          j_204++;
        };
        tmpvar_200 = color_207;
      };
      color_15 = (color_15 + (tmpvar_200 * coeff_4));
      if ((tmpvar_18 == 0)) {
        float tmpvar_285;
        tmpvar_285 = (time / 5.0);
        u_9 = (u_9 + tmpvar_285);
        v_8 = (v_8 + tmpvar_285);
        lowp vec2 tmpvar_286;
        tmpvar_286.x = u_9;
        tmpvar_286.y = v_8;
        color_15 = (color_15 * (texture (sunTexture, tmpvar_286).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_18 == 3)) {
          if (!(useNormalMap)) {
            u_9 = (u_9 + (time / 2.0));
          };
          lowp vec2 tmpvar_287;
          tmpvar_287.x = u_9;
          tmpvar_287.y = v_8;
          color_15 = (color_15 * texture (earthTexture, tmpvar_287).xyz);
        } else {
          if ((tmpvar_18 == 4)) {
            if (!(useNormalMap)) {
              u_9 = (u_9 + (time / 7.0));
            };
            lowp vec2 tmpvar_288;
            tmpvar_288.x = u_9;
            tmpvar_288.y = v_8;
            color_15 = (color_15 * texture (moonTexture, tmpvar_288).xyz);
          } else {
            if ((tmpvar_18 == 124)) {
              color_15 = (color_15 * texture (groundTexture, (0.15 * tmpvar_20.xz)).xyz);
            } else {
              if ((tmpvar_18 == 126)) {
                color_15 = (color_15 * texture (skyboxTextureBack, ((
                  -(tmpvar_20.xy)
                 + vec2(
                  (skyboxRatio / 2.0)
                )) / skyboxRatio)).xyz);
              } else {
                if ((tmpvar_18 == 127)) {
                  color_15 = (color_15 * texture (skyboxTextureDown, ((tmpvar_20.xz + vec2(
                    (skyboxRatio / 2.0)
                  )) / skyboxRatio)).xyz);
                } else {
                  if ((tmpvar_18 == 128)) {
                    color_15 = (color_15 * texture (skyboxTextureFront, ((
                      (tmpvar_20.xy * vec2(1.0, -1.0))
                     + vec2(
                      (skyboxRatio / 2.0)
                    )) / skyboxRatio)).xyz);
                  } else {
                    if ((tmpvar_18 == 129)) {
                      color_15 = (color_15 * texture (skyboxTextureLeft, ((tmpvar_20.yz + vec2(
                        (skyboxRatio / 2.0)
                      )) / skyboxRatio)).xyz);
                    } else {
                      if ((tmpvar_18 == 130)) {
                        color_15 = (color_15 * texture (skyboxTextureRight, ((
                          (tmpvar_20.zy * vec2(1.0, -1.0))
                         + vec2(
                          (skyboxRatio / 2.0)
                        )) / skyboxRatio)).xyz);
                      } else {
                        if ((tmpvar_18 == 131)) {
                          color_15 = (color_15 * texture (skyboxTextureUp, ((tmpvar_20.xz + vec2(
                            (skyboxRatio / 2.0)
                          )) / skyboxRatio)).xyz);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      bool tmpvar_289;
      tmpvar_289 = (((tmpvar_18 == 3) && (color_15.z > color_15.x)) && (color_15.z > color_15.y));
      if ((((tmpvar_196 || tmpvar_195) || tmpvar_289) && (bounceCount_5 <= depth))) {
        bool totalInternalReflection_290;
        totalInternalReflection_290 = bool(0);
        if (tmpvar_195) {
          Ray refractedRay_291;
          float tmpvar_292;
          tmpvar_292 = (1.0/(tmpvar_198));
          lowp float tmpvar_293;
          tmpvar_293 = dot (ray_1.dir, tmpvar_13);
          lowp vec3 tmpvar_294;
          if ((tmpvar_293 <= 0.0)) {
            vec3 I_295;
            I_295 = ray_1.dir;
            lowp vec3 tmpvar_296;
            lowp float tmpvar_297;
            tmpvar_297 = dot (tmpvar_13, I_295);
            lowp float tmpvar_298;
            tmpvar_298 = (1.0 - (tmpvar_292 * (tmpvar_292 * 
              (1.0 - (tmpvar_297 * tmpvar_297))
            )));
            if ((tmpvar_298 < 0.0)) {
              tmpvar_296 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_296 = ((tmpvar_292 * I_295) - ((
                (tmpvar_292 * tmpvar_297)
               + 
                sqrt(tmpvar_298)
              ) * tmpvar_13));
            };
            tmpvar_294 = tmpvar_296;
          } else {
            vec3 I_299;
            I_299 = ray_1.dir;
            lowp vec3 N_300;
            N_300 = -(tmpvar_13);
            float eta_301;
            eta_301 = (1.0/(tmpvar_292));
            lowp vec3 tmpvar_302;
            lowp float tmpvar_303;
            tmpvar_303 = dot (N_300, I_299);
            lowp float tmpvar_304;
            tmpvar_304 = (1.0 - (eta_301 * (eta_301 * 
              (1.0 - (tmpvar_303 * tmpvar_303))
            )));
            if ((tmpvar_304 < 0.0)) {
              tmpvar_302 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_302 = ((eta_301 * I_299) - ((
                (eta_301 * tmpvar_303)
               + 
                sqrt(tmpvar_304)
              ) * N_300));
            };
            tmpvar_294 = tmpvar_302;
          };
          refractedRay_291.dir = tmpvar_294;
          vec3 x_305;
          x_305 = refractedRay_291.dir;
          totalInternalReflection_290 = (sqrt(dot (x_305, x_305)) < 0.001);
          if (totalInternalReflection_290) {
            vec3 I_306;
            I_306 = ray_1.dir;
            lowp vec3 N_307;
            N_307 = -(tmpvar_13);
            ray_1.dir = normalize((I_306 - (2.0 * 
              (dot (N_307, I_306) * N_307)
            )));
            ray_1.origin = (tmpvar_20 - (tmpvar_13 * 0.001));
          } else {
            refractedRay_291.origin = (tmpvar_20 + ((tmpvar_13 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_13)
            )));
            refractedRay_291.dir = normalize(refractedRay_291.dir);
            if (!(tmpvar_196)) {
              ray_1 = refractedRay_291;
            } else {
              stack_7[stackSize_6].coeff = (coeff_4 * (vec3(1.0, 1.0, 1.0) - (tmpvar_197 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_197) * pow ((1.0 - abs(
                  dot (tmpvar_13, refractedRay_291.dir)
                )), 5.0))
              )));
              stack_7[stackSize_6].depth = bounceCount_5;
              highp int tmpvar_308;
              tmpvar_308 = stackSize_6;
              stackSize_6++;
              stack_7[tmpvar_308].ray = refractedRay_291;
            };
          };
        };
        if (((tmpvar_196 && !(totalInternalReflection_290)) || tmpvar_289)) {
          lowp float tmpvar_309;
          tmpvar_309 = dot (ray_1.dir, tmpvar_13);
          if ((tmpvar_309 < 0.0)) {
            coeff_4 = (coeff_4 * (tmpvar_197 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_197)
             * 
              pow ((1.0 - abs(dot (tmpvar_13, ray_1.dir))), 5.0)
            )));
            vec3 I_310;
            I_310 = ray_1.dir;
            ray_1.dir = normalize((I_310 - (2.0 * 
              (dot (tmpvar_13, I_310) * tmpvar_13)
            )));
            ray_1.origin = (tmpvar_20 + (tmpvar_13 * 0.001));
          } else {
            continueLoop_3 = bool(0);
          };
        };
      } else {
        continueLoop_3 = bool(0);
      };
    } else {
      color_15 = (color_15 + (vec3(0.6, 0.75, 0.9) * coeff_4));
      continueLoop_3 = bool(0);
    };
    if (isGlowOn) {
      vec3 glowness_311;
      vec3 tmpvar_312;
      tmpvar_312 = normalize(ray_1.dir);
      vec3 tmpvar_313;
      tmpvar_313 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_312)
      ) * tmpvar_312));
      float tmpvar_314;
      tmpvar_314 = sqrt(dot (tmpvar_313, tmpvar_313));
      lowp float tmpvar_315;
      lowp vec3 x_316;
      x_316 = (tmpvar_20 - eye);
      tmpvar_315 = sqrt(dot (x_316, x_316));
      float tmpvar_317;
      vec3 x_318;
      x_318 = (spheres[0].xyz - eye);
      tmpvar_317 = sqrt(dot (x_318, x_318));
      if (((tmpvar_315 + spheres[0].w) < tmpvar_317)) {
        glowness_311 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_311 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_314 * tmpvar_314))
        ), 0.0, 1.0));
      };
      color_15 = (color_15 + glowness_311);
    };
    if ((!(continueLoop_3) && (stackSize_6 > 0))) {
      highp int tmpvar_319;
      tmpvar_319 = (stackSize_6 - 1);
      stackSize_6 = tmpvar_319;
      ray_1 = stack_7[tmpvar_319].ray;
      bounceCount_5 = stack_7[tmpvar_319].depth;
      coeff_4 = stack_7[tmpvar_319].coeff;
      continueLoop_3 = bool(1);
    };
    i_2++;
  };
  lowp vec4 tmpvar_320;
  tmpvar_320.w = 1.0;
  tmpvar_320.x = color_15[colorModeInTernary[0]];
  tmpvar_320.y = color_15[colorModeInTernary[1]];
  tmpvar_320.z = color_15[colorModeInTernary[2]];
  fragColor = tmpvar_320;
}